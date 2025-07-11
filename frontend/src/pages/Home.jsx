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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaUserShield, FaTasks, FaComments } from 'react-icons/fa';
import { useEffect } from 'react';

 const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      navigate('/dash');
    }
  }, [user, navigate]);

  const bg = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box minH="100vh" bg={bg} py={10} px={6}>
      <VStack spacing={10} maxW="6xl" mx="auto">
        {/* Hero Section */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          align="center"
          spacing={10}
          textAlign={{ base: 'center', md: 'left' }}
        >
          <Box flex={1}>
            <Heading
              as="h1"
              size="2xl"
              color="teal.400"
              fontWeight="bold"
              mb={4}
              lineHeight="shorter"
            >
              Welcome to EchoBoard
            </Heading>
            <Text fontSize="lg" color={textColor} mb={6}>
              A collaborative task management app designed to boost productivity, streamline projects,
              and keep your team on track. Create tasks, assign members, comment live, and track actions in real-time.
            </Text>
            <HStack spacing={4} justify={{ base: 'center', md: 'flex-start' }}>
              {user ? (
                <Button
                  colorScheme="teal"
                  size="lg"
                  onClick={() => navigate('/dash')}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    colorScheme="teal"
                    size="lg"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme="teal"
                    size="lg"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                </>
              )}
            </HStack>
          </Box>
          <Image
            flex={1}
            src="https://illustrations.popsy.co/gray/task-management.svg"
            alt="Productivity"
            maxW="420px"
          />
        </Stack>

        {/* Features Section */}
        <VStack spacing={8} w="full">
          <Heading as="h2" size="xl" color="teal.500">
            Why EchoBoard?
          </Heading>

          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={6}
            justify="center"
            w="full"
          >
            <FeatureCard
              icon={FaTasks}
              title="Smart Task Management"
              description="Create, assign, and track tasks across your projects with intuitive drag-and-drop support."
            />
            <FeatureCard
              icon={FaComments}
              title="Live Comments"
              description="Collaborate in real-time using our integrated comment system powered by Socket.IO."
            />
            <FeatureCard
              icon={FaUserShield}
              title="Role-based Access"
              description="Admins can control everything, while members stay focused on their responsibilities."
            />
            <FeatureCard
              icon={FaRocket}
              title="Fast & Scalable"
              description="Built using modern MERN stack with scalability, performance and user experience in mind."
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
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardShadow = useColorModeValue('lg', 'dark-lg');

  return (
    <Box
      bg={cardBg}
      p={6}
      rounded="2xl"
      boxShadow={cardShadow}
      textAlign="center"
      maxW="260px"
    >
      <Box fontSize="3xl" mb={4} color="teal.400">
        {icon && <icon.type />}
      </Box>
      <Heading as="h3" size="md" mb={2}>
        {title}
      </Heading>
      <Text fontSize="sm" color="gray.500">
        {description}
      </Text>
    </Box>
  );
};

export default Home;