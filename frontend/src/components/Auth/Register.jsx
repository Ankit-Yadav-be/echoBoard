import { useState } from 'react';
import {
  Box,
  Input,
  FormControl,
  FormLabel,
  Button,
  VStack,
  useToast,
  Heading,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast({
        title: 'Registration successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    } catch (err) {
      toast({
        title: 'Registration failed',
        description: err.response?.data?.message || 'Something went wrong.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // 🌙 Theme colors
  const boxBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorder = useColorModeValue('gray.300', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headingColor = useColorModeValue('teal.600', 'teal.300');

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={{ base: 6, md: 8 }}
      borderRadius="2xl"
      boxShadow="lg"
      bg={boxBg}
      transition="all 0.3s ease"
      _hover={{ shadow: '2xl' }}
    >
      <Heading
        mb={6}
        size="lg"
        textAlign="center"
        color={headingColor}
        fontWeight="extrabold"
      >
        Create Your Account
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={5}>
          <FormControl isRequired>
            <FormLabel color={textColor}>Name</FormLabel>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              bg={inputBg}
              borderColor={inputBorder}
              borderRadius="xl"
              _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px teal' }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={textColor}>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              bg={inputBg}
              borderColor={inputBorder}
              borderRadius="xl"
              _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px teal' }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={textColor}>Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter a strong password"
              bg={inputBg}
              borderColor={inputBorder}
              borderRadius="xl"
              _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px teal' }}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            borderRadius="full"
            fontWeight="bold"
            size="md"
            _hover={{ transform: 'scale(1.03)' }}
            transition="all 0.2s ease"
          >
            Register
          </Button>

          <Text fontSize="sm" color={textColor}>
            Already have an account?{' '}
            <Button
              variant="link"
              colorScheme="blue"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Login here
            </Button>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Register;
