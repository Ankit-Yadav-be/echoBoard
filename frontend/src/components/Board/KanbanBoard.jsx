import { useEffect, useState, useContext } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  VStack,
  useColorModeValue,
  Text,
  Spinner,
  Flex,
  Icon,
} from '@chakra-ui/react';
import API from '../../services/api';
import TaskCard from './TaskCard';
import { SocketContext } from '../../context/SocketContext';
import AddTaskForm from './AddTaskForm';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useProject } from '../../context/ProjectContext';
import { FaHistory } from 'react-icons/fa';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const socket = useContext(SocketContext);
  const { selectedProject } = useProject();

  const fetchTasks = async () => {
    if (!selectedProject) return;
    try {
      const res = await API.get(`/tasks/${selectedProject._id}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const fetchLogs = async () => {
    if (!selectedProject) return;
    try {
      const res = await API.get(`/actions/${selectedProject._id}/recent`);
      setLogs(res.data);
      setLoadingLogs(false);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      fetchTasks();
      fetchLogs();
    } else {
      setTasks([]);
      setLogs([]);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (!socket) return;

    socket.on('taskCreated', (newTask) => {
      if (newTask.project === selectedProject?._id) {
        setTasks((prev) => {
          const exists = prev.find((t) => t._id === newTask._id);
          if (exists) return prev;
          return [...prev, newTask];
        });
      }
    });


    socket.on('taskUpdated', (updatedTask) => {
      if (updatedTask.project === selectedProject?._id) {
        setTasks((prev) =>
          prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
        );
      }
    });

    socket.on('taskDeleted', ({ taskId }) => {
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    });

    socket.on('actionLog', (newLog) => {
      if (newLog.project === selectedProject?._id) {
        setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
      }
    });

    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
      socket.off('actionLog');
    };
  }, [socket, selectedProject]);

  const columnBg = useColorModeValue('white', 'gray.800');
  const columnBorder = useColorModeValue('gray.200', 'gray.600');

  const getColor = (status) => {
    switch (status) {
      case 'Todo':
        return 'blue.400';
      case 'In Progress':
        return 'orange.400';
      case 'Done':
        return 'green.400';
      default:
        return 'gray.400';
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const draggedTask = tasks.find((t) => t._id === draggableId);
    const updatedTask = { ...draggedTask, status: destination.droppableId };

    try {
      await API.put(`/tasks/${draggableId}`, updatedTask);
    } catch (err) {
      console.error('Drag update failed');
    }
  };

  if (!selectedProject) {
    return (
      <Box textAlign="center" mt={10}>
        <Text fontSize="lg">Please select a project to view tasks.</Text>
      </Box>
    );
  }

  return (
    <Box height="100%" px={2}>
      <AddTaskForm />

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mt={6}>
        {/* ---- Kanban Columns ---- */}
        <Box gridColumn={{ base: '1', md: 'span 3' }} overflowX="auto">
          <DragDropContext onDragEnd={onDragEnd}>
            <Flex gap={6} wrap="nowrap" overflowX="auto" pb={2}>
              {['Todo', 'In Progress', 'Done'].map((status) => (
                <Droppable key={status} droppableId={status}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      minW="300px"
                      bg={snapshot.isDraggingOver ? 'gray.50' : columnBg}
                      border="1px solid"
                      borderColor={columnBorder}
                      borderRadius="2xl"
                      p={4}
                      boxShadow="lg"
                      transition="0.3s"
                      _hover={{ boxShadow: '2xl', transform: 'scale(1.01)' }}
                      backdropFilter="blur(6px)"
                    >
                      <Box
                        borderLeft="6px solid"
                        borderColor={getColor(status)}
                        pl={3}
                        mb={4}
                      >
                        <Heading size="md" color={getColor(status)}>
                          {status}
                        </Heading>
                      </Box>

                      <VStack spacing={4} align="stretch">
                        {tasks
                          .filter((task) => task.status === status)
                          .map((task, index) => (
                            <Draggable
                              key={task._id}
                              draggableId={String(task._id)}
                              index={index}
                            >
                              {(provided) => (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <TaskCard task={task} />
                                </Box>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </VStack>
                    </Box>
                  )}
                </Droppable>
              ))}
            </Flex>
          </DragDropContext>
        </Box>

        {/* ---- Activity Log ---- */}
        <Box
          bg={useColorModeValue('gray.100', 'gray.700')}
          p={4}
          borderRadius="2xl"
          shadow="lg"
          maxH="700px"
          overflowY="auto"
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
        >
          <Flex align="center" gap={2} mb={3}>
            <Icon as={FaHistory} color="teal.500" />
            <Heading size="sm">Activity Log</Heading>
          </Flex>
          {loadingLogs ? (
            <Spinner />
          ) : (
            <VStack align="start" spacing={3}>
              {logs.map((log) => (
                <Box
                  key={log._id}
                  p={3}
                  w="100%"
                  bg={useColorModeValue('white', 'gray.800')}
                  borderRadius="md"
                  borderLeft="4px solid teal"
                  boxShadow="sm"
                  _hover={{ bg: useColorModeValue('gray.50', 'gray.600') }}
                  transition="all 0.2s ease"
                >
                  <Text fontSize="sm" fontWeight="medium">
                    {log.description}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(log.createdAt).toLocaleString()}
                  </Text>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default KanbanBoard;
