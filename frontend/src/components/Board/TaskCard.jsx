import {
  Box,
  Text,
  Badge,
  Flex,
  Spacer,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useToast,
  Link,
  VStack,
  HStack,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  EditIcon,
  DeleteIcon,
  ExternalLinkIcon,
  ChatIcon,
} from '@chakra-ui/icons';
import {
  FaGithub,
  FaYoutube,
  FaDatabase,
  FaUser,
  FaFlag,
  FaCalendarAlt,
} from 'react-icons/fa';
import { useRef } from 'react';
import API from '../../services/api';
import EditTaskModal from './EditTaskModal';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Comment from './Comment';

dayjs.extend(relativeTime);

const TaskCard = ({ task }) => {
  const {
    isOpen: isDeleteOpen,
    onOpen: openDelete,
    onClose: closeDelete,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();

  const {
    isOpen: isCommentOpen,
    onOpen: openCommentModal,
    onClose: closeCommentModal,
  } = useDisclosure();

  const cancelRef = useRef();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await API.delete(`/tasks/${task._id}`);
      toast({
        title: 'Task deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      closeDelete();
    } catch (err) {
      toast({
        title: 'Delete failed',
        description: err.response?.data?.message || 'Server error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'yellow';
      case 'Low':
      default:
        return 'green';
    }
  };

  const bg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box
      bg={bg}
      p={5}
      borderRadius="xl"
      boxShadow="lg"
      transition="all 0.3s ease"
      _hover={{ transform: 'scale(1.02)', boxShadow: '2xl', bg: hoverBg }}
      borderLeft="5px solid"
      borderColor={getPriorityColor(task.priority) + '.400'}
    >
      <Flex align="start">
        <Box>
          <Text fontWeight="bold" fontSize="lg" mb={1}>
            {task.title}
          </Text>

          <HStack spacing={2} mb={2}>
            <Badge colorScheme={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            <Badge colorScheme="blue">{task.status}</Badge>
          </HStack>

          {task.description && (
            <Text fontSize="sm" color={textColor} mb={3}>
              {task.description}
            </Text>
          )}

          <HStack mb={2} spacing={2} fontSize="sm" color={textColor}>
            <FaUser />
            <Text>
              Assigned To:{' '}
              <strong>{task.assignedTo?.name || 'Unassigned'}</strong>
            </Text>
          </HStack>

          {task.deadline && (
            <HStack mb={2} spacing={2} fontSize="sm" color={textColor}>
              <FaCalendarAlt />
              <Text>
                Deadline:{' '}
                <strong>{dayjs(task.deadline).format('DD MMM YYYY')}</strong>{' '}
                (
                <Text as="span" color="red.400">
                  {dayjs(task.deadline).fromNow()}
                </Text>
                )
              </Text>
            </HStack>
          )}

          {task.reminder && (
            <HStack mb={2} spacing={2} fontSize="sm" color={textColor}>
              ⏰
              <Text>
                Reminder:{' '}
                <strong>{dayjs(task.reminder).format('DD MMM YYYY, hh:mm A')}</strong>{' '}
                (
                <Text as="span" color="orange.400">
                  {dayjs(task.reminder).fromNow()}
                </Text>
                )
              </Text>
            </HStack>
          )}

          <VStack align="start" spacing={1} mt={2}>
            {task.githubLink && (
              <Link href={task.githubLink} isExternal fontSize="sm" color="blue.500">
                <HStack spacing={1}>
                  <FaGithub />
                  <Text>GitHub Repo</Text>
                  <ExternalLinkIcon />
                </HStack>
              </Link>
            )}
            {task.youtubeLink && (
              <Link href={task.youtubeLink} isExternal fontSize="sm" color="red.500">
                <HStack spacing={1}>
                  <FaYoutube />
                  <Text>YouTube Video</Text>
                  <ExternalLinkIcon />
                </HStack>
              </Link>
            )}
            {task.databaseLink && (
              <Link href={task.databaseLink} isExternal fontSize="sm" color="green.600">
                <HStack spacing={1}>
                  <FaDatabase />
                  <Text>Database / API</Text>
                  <ExternalLinkIcon />
                </HStack>
              </Link>
            )}
          </VStack>
        </Box>

        <Spacer />

        <VStack spacing={1} align="end">
          <Tooltip label="Edit Task" fontSize="xs">
            <IconButton
              icon={<EditIcon />}
              size="sm"
              variant="ghost"
              onClick={openEdit}
              colorScheme="blue"
              _hover={{ transform: 'scale(1.1)' }}
            />
          </Tooltip>
          <Tooltip label="Delete Task" fontSize="xs">
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={openDelete}
              _hover={{ transform: 'scale(1.1)' }}
            />
          </Tooltip>
          <Tooltip label="Comments" fontSize="xs">
            <IconButton
              icon={<ChatIcon />}
              size="sm"
              variant="ghost"
              colorScheme="gray"
              onClick={openCommentModal}
              _hover={{ transform: 'scale(1.1)' }}
            />
          </Tooltip>
        </VStack>
      </Flex>

      {/*  Edit Modal */}
      <EditTaskModal isOpen={isEditOpen} onClose={closeEdit} task={task} />

      {/*  Delete Confirmation */}
      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={closeDelete}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Task
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDelete}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/*  Comment Modal */}
      <Modal isOpen={isCommentOpen} onClose={closeCommentModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>💬 Task Comments</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Comment taskId={task._id} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TaskCard;
