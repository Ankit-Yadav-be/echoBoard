import {
  Box,
  Heading,
  Icon,
  Divider,
  useColorModeValue,
  useColorMode,
  Button,
  Collapse,
  useDisclosure,
  Grid,
  Flex,
  Text,
  Badge,
  HStack
} from '@chakra-ui/react';
import {
  FaTasks,
  FaProjectDiagram,
  FaPlusCircle,
  FaChevronDown,
  FaChevronUp,
  FaBolt,
  FaRocket,
  FaMagic,
  FaMoon,
  FaSun,
  FaSignOutAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import KanbanBoard from '../components/Board/KanbanBoard';
import ProjectSelector from '../components/Project/ProjectSelector';
import CreateProject from '../components/Project/CreateProject';

const ProjectZen = () => {
  const sectionBg = useColorModeValue('whiteAlpha.800', 'whiteAlpha.100');
  const borderClr = useColorModeValue('gray.200', 'gray.600');
  const subText = useColorModeValue('gray.600', 'gray.400');
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Grid
      minH="100vh"
      bgGradient={useColorModeValue(
        'linear(to-b, teal.50, gray.100)',
        'linear(to-b, gray.800, gray.900)'
      )}
      templateRows="auto 1fr"
      px={{ base: 4, md: 10 }}
      py={6}
    >
      {/* ---------- HEADER ---------- */}
      <Box mb={10} position="relative">
        <Flex justify="flex-end" align="center" gap={3} pr={{ base: 2, md: 8 }} mb={2}>
          {/* Theme Toggle Button */}
          <Button
            size="sm"
            variant="ghost"
            leftIcon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            _hover={{ transform: 'scale(1.05)' }}
            transition="0.3s"
          >
            {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Button>

          {/* Logout Button Styled Same as Home */}
          <Button
            size="sm"
            colorScheme="cyan"
            leftIcon={<FaSignOutAlt />}
            onClick={handleLogout}
            px={6}
            _hover={{ transform: 'scale(1.05)' }}
            transition="0.3s"
          >
            Logout
          </Button>
        </Flex>

        {/* ---------- HERO SECTION ---------- */}
        <Box
          borderRadius="2xl"
          bgGradient={useColorModeValue(
            'linear(to-tr, teal.50, white)',
            'linear(to-tr, gray.800, gray.900)'
          )}
          border="1px solid"
          borderColor={borderClr}
          shadow="dark-lg"
          py={{ base: 12, md: 16 }}
          px={{ base: 6, md: 12 }}
          maxW="7xl"
          mx="auto"
          position="relative"
          overflow="hidden"
          transition="all 0.4s ease"
          _before={{
            content: '""',
            position: 'absolute',
            top: '-40%',
            left: '-30%',
            width: '200%',
            height: '200%',
            bgGradient: 'radial(teal.200 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            opacity: 0.05,
            zIndex: 0,
          }}
          _after={{
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            borderRadius: 'full',
            bgGradient: 'radial(#81E6D9, transparent)',
            filter: 'blur(60px)',
            opacity: 0.2,
            zIndex: 0,
          }}
        >
          <Flex
            direction="column"
            align="center"
            justify="center"
            gap={4}
            zIndex={1}
            position="relative"
            textAlign="center"
          >
            <Heading
              bgGradient="linear(to-r, teal.400, cyan.500, blue.500)"
              bgClip="text"
              fontWeight="extrabold"
              fontSize={{ base: '2xl', md: '4xl' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={3}
            >
              <Icon as={FaTasks} boxSize={7} />
              ProjectZen Workspace
            </Heading>

            <Text
              fontSize={{ base: 'sm', md: 'md' }}
              color={subText}
              maxW="lg"
              fontWeight="medium"
              opacity={0.85}
            >
              Manage your projects smartly with Kanban boards, AI suggestions, and live team sync.
            </Text>

            <HStack spacing={3} mt={2} wrap="wrap" justify="center">
              <Badge colorScheme="teal" px={3} py={1} borderRadius="full" fontSize="xs" shadow="md">
                Live Sync <Icon as={FaBolt} />
              </Badge>
              <Badge colorScheme="purple" px={3} py={1} borderRadius="full" fontSize="xs">
                AI Assist <Icon as={FaMagic} />
              </Badge>
              <Badge colorScheme="blue" px={3} py={1} borderRadius="full" fontSize="xs">
                Instant Launch <Icon as={FaRocket} />
              </Badge>
            </HStack>

            <HStack spacing={4} mt={6} flexWrap="wrap" justify="center">
              <Button
                onClick={onToggle}
                colorScheme="teal"
                size="sm"
                variant="solid"
                px={6}
                leftIcon={<Icon as={isOpen ? FaChevronUp : FaChevronDown} />}
              >
                {isOpen ? 'Hide Controls' : 'Show Controls'}
              </Button>

              <Button
                variant="outline"
                colorScheme="purple"
                size="sm"
                px={6}
                leftIcon={<Icon as={FaMagic} />}
              >
                AI Magic
              </Button>

              <Button
                variant="outline"
                colorScheme="blue"
                size="sm"
                px={6}
                leftIcon={<Icon as={FaRocket} />}
              >
                Launch Board
              </Button>
            </HStack>
          </Flex>
        </Box>

        {/* ---------- PROJECT CONTROLS ---------- */}
        <Collapse in={isOpen} animateOpacity>
          <Flex
            gap={6}
            flexWrap="wrap"
            justify="center"
            bg={sectionBg}
            backdropFilter="blur(6px)"
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderClr}
            shadow="lg"
            p={{ base: 4, md: 6 }}
            mt={4}
            maxW="7xl"
            mx="auto"
          >
            <Box flex={1} minW="300px">
              <Heading
                size="sm"
                mb={3}
                color="purple.500"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FaProjectDiagram} />
                Choose Project
              </Heading>
              <ProjectSelector />
            </Box>

            <Divider orientation="vertical" height="auto" />

            <Box flex={1} minW="300px">
              <Heading
                size="sm"
                mb={3}
                color="blue.500"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FaPlusCircle} />
                Start New Project
              </Heading>
              <CreateProject />
            </Box>
          </Flex>
        </Collapse>
      </Box>

      {/* ---------- KANBAN BOARD ---------- */}
      <Box
        overflow="auto"
        py={4}
        maxW="7xl"
        mx="auto"
        w="100%"
        css={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 transparent',
        }}
      >
        <KanbanBoard />
      </Box>
    </Grid>
  );
};

export default ProjectZen;
