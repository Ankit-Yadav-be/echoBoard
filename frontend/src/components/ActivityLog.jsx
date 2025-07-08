import { useEffect, useState, useContext } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import API from '../services/api';
import { SocketContext } from '../context/SocketContext';
import { useProject } from '../context/ProjectContext'; // ✅ project context

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useContext(SocketContext);
  const { selectedProject } = useProject(); // ✅ get selected project

  const fetchLogs = async () => {
    if (!selectedProject) return;

    setLoading(true);
    try {
      const res = await API.get(`/actions/${selectedProject._id}/recent`);
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedProject]); // ✅ refetch logs on project switch

  useEffect(() => {
    if (!socket || !selectedProject) return;

    const handler = (newLog) => {
      if (newLog.project === selectedProject._id) {
        setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
      }
    };

    socket.on('actionLog', handler);

    return () => socket.off('actionLog', handler);
  }, [socket, selectedProject]);

  const logBg = useColorModeValue('gray.100', 'gray.700');

  if (!selectedProject) {
    return (
      <Box p={4} bg={logBg} borderRadius="md">
        <Text fontSize="sm" color="gray.500">
          Please select a project to view activity logs.
        </Text>
      </Box>
    );
  }

  return (
    <Box
      w={{ base: '100%', md: '300px' }}
      bg={logBg}
      p={4}
      borderRadius="lg"
      boxShadow="md"
      maxH="500px"
      overflowY="auto"
    >
      <Heading size="md" mb={3}>
        Activity Log
      </Heading>

      {loading ? (
        <Spinner />
      ) : logs.length === 0 ? (
        <Text fontSize="sm" color="gray.500">No recent activity.</Text>
      ) : (
        <VStack align="start" spacing={3}>
          {logs.map((log) => (
            <Box key={log._id} p={2} borderBottom="1px dashed gray">
              <Text fontSize="sm" color="gray.600">
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
  );
};

export default ActivityLog;
