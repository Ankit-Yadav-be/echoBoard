import { useProject } from '../../context/ProjectContext';
import {
  Box,
  Select,
  Text,
  FormControl,
  FormLabel,
  Spinner,
  useColorModeValue,
  Icon,
  Flex,
  Badge,
  Avatar,
  Wrap,
  WrapItem,
  Tooltip,
  Heading,
  Divider,
  Button,
  useToast,
  HStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { FaProjectDiagram, FaUserMinus } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import API from '../../services/api';

const ProjectSelector = () => {
  const { projects, selectedProject, setSelectedProject, fetchProjects } = useProject();
  const [allUsers, setAllUsers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const cancelRef = useRef();

  const toast = useToast();

  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const bg = useColorModeValue('whiteAlpha.900', 'gray.800');
  const dropdownBg = useColorModeValue('white', 'gray.700');
  const inputText = useColorModeValue('gray.800', 'gray.200');
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeText = useColorModeValue('blue.800', 'blue.300');

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await API.get('/auth/users');
        setAllUsers(res.data);
      } catch (err) {
        console.error('Error fetching users');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchAllUsers();
  }, []);

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    const project = projects.find((p) => p._id === projectId);
    setSelectedProject(project);
  };

  const handleAddMember = async () => {
    if (!newMember || !selectedProject) return;
    setAdding(true);
    try {
      await API.post(`/projects/${selectedProject._id}/add-member`, { userId: newMember });

      const addedUser = allUsers.find((u) => u._id === newMember);
      if (addedUser) {
        const updatedProject = {
          ...selectedProject,
          members: [...(selectedProject.members || []), addedUser],
        };
        setSelectedProject(updatedProject);
      }

      toast({
        title: 'Member added!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setNewMember('');
      fetchProjects();
    } catch (err) {
      toast({
        title: 'Failed to add member',
        description: err.response?.data?.message || 'Something went wrong!',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setAdding(false);
    }
  };

  const openRemoveDialog = (member) => {
    setMemberToRemove(member);
    setIsDialogOpen(true);
  };

  const confirmRemoveMember = async () => {
    if (!selectedProject || !memberToRemove) return;
    setRemovingId(memberToRemove._id);
    setIsDialogOpen(false);

    try {
      await API.delete(`/projects/${selectedProject._id}/remove-member`, {
        data: { userId: memberToRemove._id },
      });

      const updatedProject = {
        ...selectedProject,
        members: selectedProject.members.filter((m) => m._id !== memberToRemove._id),
      };
      setSelectedProject(updatedProject);

      toast({
        title: 'Member removed!',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });

      fetchProjects();
    } catch (err) {
      toast({
        title: 'Failed to remove member',
        description: err.response?.data?.message || 'Something went wrong!',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setRemovingId(null);
      setMemberToRemove(null);
    }
  };

  return (
    <Box
      maxW="xl"
      mx="auto"
      w="100%"
      p={{ base: 4, md: 6 }}
      bg={bg}
      rounded="2xl"
      border="1px solid"
      borderColor={borderColor}
      shadow="lg"
      transition="all 0.3s ease"
      _hover={{ shadow: 'xl' }}
    >
      <Heading size="md" mb={4} display="flex" alignItems="center" gap={3} color={inputText}>
        <Icon as={FaProjectDiagram} color="blue.400" boxSize={5} />
        Project Workspace
      </Heading>

      {!projects.length ? (
        <Flex align="center" justify="center" py={4}>
          <Spinner size="sm" mr={2} />
          <Text color="gray.500" fontSize="sm">Loading your projects...</Text>
        </Flex>
      ) : (
        <FormControl>
          <FormLabel fontWeight="semibold" color="gray.500">
            Choose a Project
          </FormLabel>
          <Select
            placeholder="Select a project"
            value={selectedProject?._id || ''}
            onChange={handleProjectChange}
            bg={dropdownBg}
            color={inputText}
            borderColor={borderColor}
            borderRadius="xl"
            size="md"
            _hover={{ borderColor: 'blue.300' }}
            _focus={{
              borderColor: 'blue.400',
              boxShadow: '0 0 0 1px #4299e1',
            }}
          >
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </Select>
        </FormControl>
      )}

      {selectedProject && (
        <Box bg={activeBg} mt={6} p={4} borderRadius="xl" border="1px solid" borderColor="blue.300" shadow="md">
          <Flex align="center" gap={3} mb={2}>
            <Icon as={FaProjectDiagram} color="blue.400" boxSize={5} />
            <Box>
              <Text fontSize="sm" fontWeight="bold" color={activeText}>
                Currently Working On:
              </Text>
              <Text fontSize="md" color={activeText}>
                {selectedProject.name}
              </Text>
            </Box>
            <Badge ml="auto" colorScheme="green" variant="subtle">
              Active
            </Badge>
          </Flex>

          <Divider my={2} />

          {selectedProject.members?.length > 0 ? (
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="gray.500" mb={2}>
                Team Members
              </Text>
              <Wrap spacing={3}>
                {selectedProject.members.map((member) => (
                  <WrapItem key={member._id}>
                    <HStack spacing={2}>
                      <Tooltip label={`${member.name} (${member.email})`} hasArrow>
                        <Avatar name={member.name} size="sm" bg="blue.400" color="white" />
                      </Tooltip>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => openRemoveDialog(member)}
                        isLoading={removingId === member._id}
                        leftIcon={<FaUserMinus />}
                        variant="ghost"
                      >
                        Remove
                      </Button>
                    </HStack>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          ) : (
            <Text color="gray.500" fontSize="sm" mt={2}>
              No members in this project yet.
            </Text>
          )}

          {/* Add Member */}
          <Box mt={5}>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium" color="gray.600">
                Add a Member
              </FormLabel>
              <Select
                placeholder="Select user"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                size="sm"
                bg={dropdownBg}
                color={inputText}
                borderRadius="md"
                mb={2}
              >
                {allUsers
                  .filter((u) => !selectedProject.members.some((m) => m._id === u._id))
                  .map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
              </Select>
            </FormControl>
            <Button
              colorScheme="teal"
              size="sm"
              onClick={handleAddMember}
              isLoading={adding}
              isDisabled={!newMember}
            >
              Add Member
            </Button>
          </Box>
        </Box>
      )}

    
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove Member
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to remove{' '}
              <strong>{memberToRemove?.name}</strong> from this project?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmRemoveMember}
                ml={3}
                isLoading={removingId === memberToRemove?._id}
              >
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ProjectSelector;
