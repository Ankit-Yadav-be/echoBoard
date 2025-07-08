import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  HStack,
  Avatar,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import API from '../../services/api';
import io from 'socket.io-client';

const socket = io('https://echoboard.onrender.com');

// Get user from localStorage
const getLoggedInUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const Comment = ({ taskId }) => {
  const user = getLoggedInUser();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const toast = useToast();
  const bottomRef = useRef();

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const msgTextColor = useColorModeValue('gray.600', 'gray.300');

  useEffect(() => {
    fetchComments();

    socket.emit('joinTask', taskId);

    socket.on('newComment', (comment) => {
      const commentTaskId =
        typeof comment.task === 'string' ? comment.task : comment.task?._id;

      if (commentTaskId === taskId) {
        setComments((prev) => [...prev, comment]);
      }
    });

    return () => {
      socket.off('newComment');
    };
  }, [taskId]);

  const fetchComments = async () => {
    try {
      const { data } = await API.get(`/task/${taskId}/comments`);
      setComments(data);
    } catch (err) {
      toast({
        title: 'Failed to fetch comments',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const { data } = await API.post(`/task/${taskId}/comments`, {
        message: text,
      });
      socket.emit('sendComment', { taskId, comment: data });
      setText('');
    } catch (err) {
      toast({
        title: 'Failed to send comment',
        description: err.response?.data?.message || 'Server error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  return (
    <Box mt={3} bg={bgColor} p={4} borderRadius="md">
      <VStack
        spacing={3}
        align="stretch"
        maxH="300px"
        overflowY="auto"
        mb={3}
        pr={2}
      >
        {comments.map((c) => (
          <HStack key={c._id} align="start" spacing={3}>
            <Avatar size="sm" name={c.user?.name} />
            <Box>
              <Text fontWeight="semibold" fontSize="sm">
                {c.user?.name || 'Unknown'}
              </Text>
              <Text fontSize="sm" color={msgTextColor}>
                {c.message || '—'}
              </Text>
            </Box>
          </HStack>
        ))}
        <div ref={bottomRef} />
      </VStack>

      <HStack>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          size="sm"
          borderRadius="full"
        />
        <Button
          onClick={handleSend}
          colorScheme="teal"
          size="sm"
          borderRadius="full"
        >
          Send
        </Button>
      </HStack>
    </Box>
  );
};

export default Comment;
