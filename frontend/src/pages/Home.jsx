import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Image,
  Stack,
  Icon,
  useColorMode,
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
  const bg = useColorModeValue('linear(to-b, teal.50, white)', 'linear(to-b, gray.900, gray.800)');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (user) {
      navigate('/dash');
    }
  }, [user, navigate]);

  return (
    <Box
      minH="100vh"
      bgGradient={bg}
      py={10}
      px={6}
      transition="0.4s ease-in-out"
      overflow="hidden"
      position="relative"
    >
      {/* Background Glow Effect */}
      <Box
        position="absolute"
        top="10%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="400px"
        h="400px"
        bg="teal.300"
        opacity={0.2}
        filter="blur(120px)"
        zIndex={0}
        borderRadius="full"
      />

      <VStack spacing={10} maxW="6xl" mx="auto" position="relative" zIndex={1}>
        {/* Theme Toggle */}
        <Box w="full" display="flex" justifyContent="flex-end" pr={2}>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="teal"
            leftIcon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            _hover={{ transform: 'scale(1.05)' }}
          >
            {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Button>
        </Box>

        {/* Hero Section */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          align="center"
          spacing={10}
          textAlign={{ base: 'center', md: 'left' }}
        >
          <MotionBox
            flex={1}
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, teal.300, blue.400, purple.500)"
              bgClip="text"
              fontWeight="extrabold"
              lineHeight="shorter"
              mb={4}
            >
              Welcome to EchoBoard 🚀
            </Heading>
            <Text fontSize="lg" color={textColor} mb={6}>
              Boost your team’s productivity with real-time task collaboration,
              live comments, and powerful project control — all in one place.
            </Text>
            <HStack spacing={4} justify={{ base: 'center', md: 'flex-start' }}>
              {user ? (
                <Button
                  size="lg"
                  colorScheme="teal"
                  onClick={() => navigate('/dash')}
                  _hover={{ transform: 'scale(1.05)' }}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    colorScheme="teal"
                    onClick={() => navigate('/login')}
                    _hover={{ transform: 'scale(1.05)' }}
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
                  >
                    Register
                  </Button>
                </>
              )}
            </HStack>
          </MotionBox>

          <MotionBox
            flex={1}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9 }}
          >
            <Image
              src="/assets/bussiness.jpg"
              alt="Productivity illustration"
              maxW="420px"
              borderRadius="xl"
              boxShadow="2xl"
            />
          </MotionBox>
        </Stack>

        {/* Features Section */}
        <VStack spacing={8} w="full">
          <Heading
            as="h2"
            size="xl"
            bgGradient="linear(to-r, teal.300, blue.400)"
            bgClip="text"
            fontWeight="bold"
            textAlign="center"
          >
            Why EchoBoard?
          </Heading>

          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={6}
            justify="center"
            w="full"
            flexWrap="wrap"
          >
            <FeatureCard
              icon={FaTasks}
              title="Smart Task Management"
              description="Create, assign, and track tasks effortlessly with our drag-and-drop boards."
            />
            <FeatureCard
              icon={FaComments}
              title="Live Comments"
              description="Collaborate in real-time using powerful integrated chat & socket engine."
            />
            <FeatureCard
              icon={FaUserShield}
              title="Role-based Access"
              description="Maintain control with admin privileges and tailored user roles."
            />
            <FeatureCard
              icon={FaRocket}
              title="Fast & Scalable"
              description="Built with modern MERN stack and optimized for performance."
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
  const cardBg = useColorModeValue('whiteAlpha.900', 'gray.800');
  const cardShadow = useColorModeValue('lg', 'dark-lg');

  return (
    <MotionBox
      whileHover={{ scale: 1.05, rotate: 0.5 }}
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
