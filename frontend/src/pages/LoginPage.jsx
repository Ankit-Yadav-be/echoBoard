import { Box, Heading, Flex, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaUserLock } from 'react-icons/fa';
import Login from '../components/Auth/Login';

const LoginPage = () => {
  const pageBg = useColorModeValue('linear(to-br, teal.100, blue.100)', 'linear(to-br, gray.800, gray.900)');
  const boxBg = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('teal.600', 'teal.300');
  const shadow = useColorModeValue('2xl', 'dark-lg');

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient={pageBg}
      px={4}
      py={8}
    >
      <Box
        w="full"
        maxW="md"
        bg={boxBg}
        p={8}
        borderRadius="2xl"
        boxShadow={shadow}
        textAlign="center"
        transition="0.3s ease"
        _hover={{ transform: 'scale(1.005)', shadow: 'xl' }}
      >
        <Heading
          size="lg"
          mb={6}
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={3}
          color={headingColor}
        >
          <Icon as={FaUserLock} boxSize={6} />
          Login to ProjectZen
        </Heading>

        <Login />
      </Box>
    </Flex>
  );
};

export default LoginPage;
