import { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  Heading,
  VStack,
  useColorModeValue,
  Icon,
  Collapse,
  useDisclosure,
  Flex,
  Checkbox,
} from '@chakra-ui/react';
import {
  FaPlus,
  FaUserPlus,
  FaTasks,
  FaChevronDown,
  FaChevronUp,
  FaFlag,
  FaCalendarAlt,
} from 'react-icons/fa';
import API from '../../services/api';
import { useProject } from '../../context/ProjectContext';

const AddTaskForm = () => {
  const { selectedProject } = useProject();
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    assignedTo: '',
    githubLink: '',
    youtubeLink: '',
    databaseLink: '',
    deadline: '',
    reminder: '',
  });
  const [users, setUsers] = useState([]);
  const [useSmartAssign, setUseSmartAssign] = useState(false);
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  const fetchUsers = async () => {
    if (!selectedProject) return;
    try {
      const res = await API.get(`/projects/${selectedProject._id}/members`);
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load project members');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedProject]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) return alert('Please select a project first.');

    try {
      const payload = {
        ...form,
        project: selectedProject._id,
      };

      if (useSmartAssign) delete payload.assignedTo;

      await API.post('/tasks/createtask', payload);

      setForm({
        title: '',
        description: '',
        status: 'Todo',
        priority: 'Medium',
        assignedTo: '',
        githubLink: '',
        youtubeLink: '',
        databaseLink: '',
        deadline: '',
        reminder: '',
      });
      setUseSmartAssign(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Task creation failed');
    }
  };

  const bg = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box id="add-task-form-section">
      <Flex justify="center" mb={4}>
        <Button
          onClick={onToggle}
          size="sm"
          colorScheme="teal"
          variant="solid"
          leftIcon={<Icon as={isOpen ? FaChevronUp : FaChevronDown} />}
          borderRadius="xl"
        >
          {isOpen ? 'Hide Add Task Form' : 'Show Add Task Form'}
        </Button>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Box
          as="form"
          onSubmit={handleSubmit}
          bg={bg}
          border="1px solid"
          borderColor={border}
          p={6}
          borderRadius="2xl"
          shadow="xl"
          maxW="600px"
          mx="auto"
          transition="all 0.3s ease"
        >
          <Heading
            size="md"
            mb={5}
            color="teal.500"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Icon as={FaPlus} />
            Add New Task
          </Heading>

          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                placeholder="Enter task title"
                value={form.title}
                onChange={handleChange}
                borderRadius="xl"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                placeholder="Enter description"
                value={form.description}
                onChange={handleChange}
                borderRadius="xl"
              />
            </FormControl>

            <Flex gap={4} w="100%" flexWrap="wrap">
              <FormControl flex={1}>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  borderRadius="xl"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </Select>
              </FormControl>

              <FormControl flex={1}>
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <Icon as={FaFlag} />
                  Priority
                </FormLabel>
                <Select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  borderRadius="xl"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Select>
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel>GitHub Link</FormLabel>
              <Input
                name="githubLink"
                placeholder="https://github.com/..."
                value={form.githubLink}
                onChange={handleChange}
                borderRadius="xl"
              />
            </FormControl>

            <FormControl>
              <FormLabel>YouTube Link</FormLabel>
              <Input
                name="youtubeLink"
                placeholder="https://youtube.com/..."
                value={form.youtubeLink}
                onChange={handleChange}
                borderRadius="xl"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Database Link</FormLabel>
              <Input
                name="databaseLink"
                placeholder="https://..."
                value={form.databaseLink}
                onChange={handleChange}
                borderRadius="xl"
              />
            </FormControl>

            <FormControl>
              <FormLabel display="flex" alignItems="center" gap={2}>
                <Icon as={FaCalendarAlt} />
                Deadline
              </FormLabel>
              <Input
                type="datetime-local"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                borderRadius="xl"
              />
            </FormControl>

            <FormControl>
              <FormLabel display="flex" alignItems="center" gap={2}>
                ⏰ Reminder
              </FormLabel>
              <Input
                type="datetime-local"
                name="reminder"
                value={form.reminder}
                onChange={handleChange}
                borderRadius="xl"
              />
            </FormControl>

            <FormControl>
              <FormLabel display="flex" alignItems="center" gap={2}>
                <Icon as={FaUserPlus} />
                Assign To
              </FormLabel>

              <Checkbox
                isChecked={useSmartAssign}
                onChange={(e) => setUseSmartAssign(e.target.checked)}
                mb={2}
                colorScheme="green"
              >
                Smart Assign
              </Checkbox>

              <Select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                placeholder="Unassigned"
                borderRadius="xl"
                isDisabled={useSmartAssign}
              >
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              w="full"
              borderRadius="full"
              fontWeight="semibold"
              leftIcon={<FaTasks />}
              _hover={{ transform: 'scale(1.03)' }}
              transition="all 0.2s ease"
            >
              Create Task
            </Button>
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default AddTaskForm;
