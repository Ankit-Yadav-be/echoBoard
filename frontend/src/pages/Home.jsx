import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Image,
  Icon,
  useColorMode,
  Stack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FaRocket,
  FaUserShield,
  FaTasks,
  FaComments,
  FaSun,
  FaMoon,
} from 'react-icons/fa';
import { useEffect } from 'react';
import React from 'react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const bg = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (user) {
      navigate('/dash');
    }
  }, [user, navigate]);

  return (
    <Box minH="100vh" bg={bg} py={10} px={6} transition="0.4s ease-in-out">
      <VStack spacing={12} maxW="7xl" mx="auto">
        {/* Theme Toggle */}
        <Box w="full" display="flex" justifyContent="flex-end" pr={2}>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            colorScheme="teal"
            _hover={{ transform: 'scale(1.05)' }}
          >
            {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Button>
        </Box>

        {/* Hero Section */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          align="center"
          spacing={12}
          textAlign={{ base: 'center', md: 'left' }}
          w="full"
        >
          <Box flex={1}>
            <Heading
              as="h1"
              fontSize={{ base: '3xl', md: '5xl' }}
              bgGradient="linear(to-r, teal.400, blue.400, purple.500)"
              bgClip="text"
              fontWeight="extrabold"
              lineHeight="shorter"
              mb={4}
            >
              Welcome to EchoBoard 🚀
            </Heading>
            <Text fontSize={{ base: 'md', md: 'xl' }} color={textColor} mb={6}>
              Collaborate smarter with real-time task management, AI-powered comments, and dynamic project control — all in one sleek platform.
            </Text>
            <HStack spacing={4} justify={{ base: 'center', md: 'flex-start' }}>
              {user ? (
                <Button colorScheme="teal" size="lg" onClick={() => navigate('/dash')}>
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    colorScheme="teal"
                    size="lg"
                    onClick={() => navigate('/login')}
                    _hover={{ transform: 'scale(1.05)' }}
                    transition="0.3s"
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme="teal"
                    size="lg"
                    onClick={() => navigate('/register')}
                    _hover={{
                      transform: 'scale(1.05)',
                      bg: 'teal.500',
                      color: 'white',
                      borderColor: 'teal.500',
                    }}
                    transition="0.3s"
                  >
                    Register
                  </Button>
                </>
              )}
            </HStack>
          </Box>

          <MotionBox
            flex={1}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/assets/bussiness.jpg"
              alt="Productivity Illustration"
              w="100%"
              borderRadius="xl"
              shadow="xl"
              transition="0.4s"
              _hover={{ transform: 'scale(1.02)' }}
            />
          </MotionBox>
        </Stack>

        {/* Features Section */}
        <VStack spacing={8} w="full" pt={10}>
          <Heading
            as="h2"
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="bold"
            color="teal.400"
            textAlign="center"
          >
            Why EchoBoard?
          </Heading>

          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={6}
            justify="center"
            flexWrap="wrap"
          >
            <FeatureCard
              icon={FaTasks}
              title="Smart Task Management"
              description="Create, assign, and track tasks effortlessly with drag-and-drop boards."
            />
            <FeatureCard
              icon={FaComments}
              title="Live Comments"
              description="Collaborate in real-time using integrated chat powered by Socket.IO."
            />
            <FeatureCard
              icon={FaUserShield}
              title="Role-based Access"
              description="Admin and member roles with powerful permissions and visibility control."
            />
            <FeatureCard
              icon={FaRocket}
              title="Fast & Scalable"
              description="MERN-powered backend optimized for speed, scalability and real-time."
            />
          </Stack>
        </VStack>

        <Text fontSize="sm" color="gray.500" pt={10}>
          © {new Date().getFullYear()} EchoBoard — Created by Ankit Yadav
        </Text>
      </VStack>
    </Box>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('xl', 'dark-lg');

  return (
    <MotionBox
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
      bg={cardBg}
      p={6}
      rounded="2xl"
      boxShadow={cardShadow}
      textAlign="center"
      maxW="260px"
    >
      <Box fontSize="3xl" mb={4} color="teal.400">
        <Icon as={icon} />
      </Box>
      <Heading as="h3" size="md" mb={2}>
        {title}
      </Heading>
      <Text fontSize="sm" color="gray.500">
        {description}
      </Text>
    </MotionBox>
  );
};

export default Home;
