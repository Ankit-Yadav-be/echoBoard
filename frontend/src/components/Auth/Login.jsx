// src/pages/Login.jsx
import { useState } from 'react';
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  useToast,
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
  Heading,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { setToken } = useAuth(); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      const { token, user } = res.data;

    
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));

      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/');
    } catch (err) {
      toast({
        title: 'Login failed',
        description: err.response?.data?.message || 'Invalid credentials',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Chakra UI theming
  const boxBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorder = useColorModeValue('gray.300', 'gray.600');
  const headingColor = useColorModeValue('teal.600', 'teal.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={8}
      borderRadius="2xl"
      boxShadow="xl"
      bg={boxBg}
      border="1px solid"
      borderColor={inputBorder}
      transition="0.3s ease"
      _hover={{ shadow: '2xl' }}
    >
      <Heading mb={6} size="lg" textAlign="center" color={headingColor}>
        Login
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={5}>
          <FormControl isRequired>
            <FormLabel color={textColor}>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              borderRadius="xl"
              bg={inputBg}
              borderColor={inputBorder}
              _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px teal' }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={textColor}>Password</FormLabel>
            <InputGroup>
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                borderRadius="xl"
                bg={inputBg}
                borderColor={inputBorder}
                _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px teal' }}
              />
              <InputRightElement>
                <IconButton
                  size="sm"
                  variant="ghost"
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            borderRadius="full"
            fontWeight="bold"
            size="md"
            isLoading={loading}
            _hover={{ transform: 'scale(1.03)' }}
            transition="all 0.2s ease"
          >
            Login
          </Button>

          <Text fontSize="sm" color={textColor}>
            Don’t have an account?{' '}
            <Button
              variant="link"
              colorScheme="blue"
              size="sm"
              onClick={() => navigate('/register')}
            >
              Register here
            </Button>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
