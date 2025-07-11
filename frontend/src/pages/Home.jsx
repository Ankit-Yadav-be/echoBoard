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
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (user) {
      navigate('/dash');
    }
  }, [user, navigate]);

  return (
    <Box position="relative" minH="100vh" overflow="hidden">
      {/* Background Image */}
      <Image
        src="/assets/bussiness.jpg"
        alt="Background"
        objectFit="cover"
        w="100%"
        h="100vh"
        position="absolute"
        top={0}
        left={0}
        zIndex={-1}
        filter="brightness(0.6)"
      />

      {/* Content Overlay */}
      <VStack spacing={10} maxW="6xl" mx="auto" px={6} pt={10} position="relative" zIndex={1}>
        {/* Theme Toggle */}
        <Box w="full" display="flex" justifyContent="flex-end">
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
          direction="column"
          align="center"
          spacing={8}
          textAlign="center"
          py={{ base: 10, md: 20 }}
        >
          <Heading
            fontSize={{ base: '3xl', md: '5xl' }}
            bgGradient="linear(to-r, teal.300, blue.400, purple.500)"
            bgClip="text"
            fontWeight="extrabold"
            lineHeight="shorter"
          >
            Welcome to EchoBoard 🚀
          </Heading>
          <Text fontSize={{ base: 'md', md: 'xl' }} color="white" maxW="3xl">
            Boost your team’s productivity with real-time task collaboration,
            live comments, and powerful project control — all in one place.
          </Text>
          <HStack spacing={4}>
            {user ? (
              <Button size="lg" colorScheme="teal" onClick={() => navigate('/dash')}>
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
        </Stack>

        {/* Features Section */}
        <VStack spacing={8} w="full" pt={{ base: 10, md: 20 }}>
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

        <Text fontSize="sm" color="gray.200" pt={10}>
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
      color={useColorModeValue('gray.700', 'gray.100')}
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
