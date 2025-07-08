import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import API from '../../services/api';
import { useProject } from '../../context/ProjectContext';

const EditTaskModal = ({ isOpen, onClose, task }) => {
  const [form, setForm] = useState({});
  const [users, setUsers] = useState([]);
  const toast = useToast();
  const { selectedProject } = useProject();

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Todo',
        priority: task.priority || 'Medium',
        assignedTo: task.assignedTo?._id || '',
        githubLink: task.githubLink || '',
        youtubeLink: task.youtubeLink || '',
        databaseLink: task.databaseLink || '',
        deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
        reminder: task.reminder ? new Date(task.reminder).toISOString().slice(0, 16) : '',
      });
    }
  }, [task]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!selectedProject) return;
      try {
        const res = await API.get(`/projects/${selectedProject._id}/members`);
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch members', err);
      }
    };

    fetchMembers();
  }, [selectedProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/tasks/${task._id}`, form);
      toast({
        title: 'Task updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      toast({
        title: 'Update failed',
        description: err.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mb={3} isRequired>
            <FormLabel>Title</FormLabel>
            <Input name="title" value={form.title} onChange={handleChange} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Description</FormLabel>
            <Input name="description" value={form.description} onChange={handleChange} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Status</FormLabel>
            <Select name="status" value={form.status} onChange={handleChange}>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </Select>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Priority</FormLabel>
            <Select name="priority" value={form.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Select>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Deadline</FormLabel>
            <Input
              name="deadline"
              type="datetime-local"
              value={form.deadline}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Reminder</FormLabel>
            <Input
              name="reminder"
              type="datetime-local"
              value={form.reminder}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Assigned To</FormLabel>
            <Select
              name="assignedTo"
              value={form.assignedTo || ''}
              onChange={handleChange}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>GitHub Link</FormLabel>
            <Input
              name="githubLink"
              placeholder="https://github.com/..."
              value={form.githubLink}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>YouTube Link</FormLabel>
            <Input
              name="youtubeLink"
              placeholder="https://youtube.com/..."
              value={form.youtubeLink}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Database Link</FormLabel>
            <Input
              name="databaseLink"
              placeholder="https://..."
              value={form.databaseLink}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleUpdate}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTaskModal;
