import { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Button,
  useToast,
  FormControl,
  FormLabel,
  Checkbox,
  CheckboxGroup,
  VStack,
  Spinner,
  Text,
  Heading,
  useColorModeValue,
  Divider,
  Icon,
  Avatar,
  HStack,
  Tooltip,
  Flex,
} from '@chakra-ui/react';
import API from '../../services/api';
import { useProject } from '../../context/ProjectContext';
import { FaUsers, FaProjectDiagram, FaPlus } from 'react-icons/fa';

const CreateProject = () => {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();
  const { fetchProjects } = useProject();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await API.get('/auth/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchAllUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const { data: project } = await API.post('/projects', { name });

      for (let userId of selectedUserIds) {
        try {
          await API.post(`/projects/${project._id}/add-member`, { userId });
        } catch (err) {
          console.warn(`Failed to add ${userId}:`, err.response?.data?.message);
        }
      }

      toast({
        title: '🎉 Project Created!',
        description: `${project.name} created with ${selectedUserIds.length} members.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setName('');
      setSelectedUserIds([]);
      setSearchTerm('');
      fetchProjects();
    } catch (err) {
      toast({
        title: 'Failed to create project',
        description: err.response?.data?.message || 'Something went wrong!',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // 🌙 Dark mode styling
  const bg = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('gray.200', 'gray.700');
  const sectionBg = useColorModeValue('gray.50', 'gray.700');
  const inputText = useColorModeValue('gray.800', 'gray.200');

  // 🔍 Filter users by search term
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      maxW={{ base: '95%', md: '640px' }}
      mx="auto"
      mt={8}
      p={{ base: 5, md: 8 }}
      borderRadius="2xl"
      boxShadow="2xl"
      bg={bg}
      border="1px solid"
      borderColor={border}
      transition="all 0.3s ease"
      _hover={{ transform: 'scale(1.005)' }}
    >
      {/* Header */}
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'flex-start', sm: 'center' }}
        justify="space-between"
        bgGradient="linear(to-r, teal.400, blue.400)"
        color="white"
        p={4}
        borderRadius="lg"
        mb={6}
        gap={2}
      >
        <HStack spacing={3}>
          <Icon as={FaProjectDiagram} boxSize={5} />
          <Heading size="md">Create New Project</Heading>
        </HStack>
        <Icon as={FaPlus} />
      </Flex>

      <form onSubmit={handleSubmit}>
        {/* Project Name */}
        <FormControl isRequired mb={5}>
          <FormLabel fontWeight="bold" color={inputText}>Project Name</FormLabel>
          <Input
            placeholder="e.g. AI Task Manager"
            value={name}
            onChange={(e) => setName(e.target.value)}
            borderRadius="xl"
            focusBorderColor="teal.400"
            bg={useColorModeValue('white', 'gray.700')}
            _placeholder={{ color: 'gray.400' }}
            color={inputText}
          />
        </FormControl>

        <Divider mb={5} />

        {/* Team Members */}
        <FormControl mb={5}>
          <FormLabel fontWeight="bold" display="flex" alignItems="center" gap={2} color={inputText}>
            <Icon as={FaUsers} />
            Select Team Members
          </FormLabel>

          {/* Search Box */}
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb={3}
            size="sm"
            borderRadius="md"
            bg={useColorModeValue('white', 'gray.700')}
            color={inputText}
          />

          {loadingUsers ? (
            <Spinner size="md" />
          ) : filteredUsers.length === 0 ? (
            <Text color="gray.500">No matching users.</Text>
          ) : (
            <Box
              maxH="240px"
              overflowY="auto"
              p={3}
              borderRadius="lg"
              border="1px solid"
              borderColor={border}
              bg={sectionBg}
              sx={{
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-thumb': {
                  background: useColorModeValue('#CBD5E0', '#4A5568'),
                  borderRadius: '6px',
                },
              }}
            >
              <CheckboxGroup value={selectedUserIds} onChange={setSelectedUserIds}>
                <VStack align="start" spacing={3}>
                  {filteredUsers.map((u) => (
                    <Checkbox key={u._id} value={u._id} colorScheme="teal" w="100%">
                      <HStack spacing={3}>
                        <Tooltip label={u.email} fontSize="xs" hasArrow>
                          <Avatar name={u.name} size="sm" />
                        </Tooltip>
                        <Text fontWeight="medium">{u.name}</Text>
                      </HStack>
                    </Checkbox>
                  ))}
                </VStack>
              </CheckboxGroup>
            </Box>
          )}
        </FormControl>

        {/* Submit */}
        <Button
          type="submit"
          colorScheme="teal"
          w="full"
          borderRadius="full"
          fontWeight="bold"
          size="lg"
          leftIcon={<FaPlus />}
          mt={4}
          _hover={{ transform: 'scale(1.02)', bg: 'teal.500' }}
          transition="all 0.2s ease"
        >
          Create Project
        </Button>
      </form>
    </Box>
  );
};

export default CreateProject;
