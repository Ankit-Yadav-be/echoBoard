import { Box, Heading, useColorModeValue } from '@chakra-ui/react';
import Register from '../components/Auth/Register';

const RegisterPage = () => {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient={useColorModeValue(
        'linear(to-b, teal.50, gray.100)',
        'linear(to-b, gray.800, gray.900)'
      )}
      px={4}
    >
      <Box w="full" maxW="lg">
        <Heading
          textAlign="center"
          mb={6}
          fontSize={{ base: '2xl', md: '3xl' }}
          bgGradient="linear(to-r, teal.500, blue.500)"
          bgClip="text"
          fontWeight="extrabold"
        >
          Create Your Account
        </Heading>
        <Register />
      </Box>
    </Box>
  );
};

export default RegisterPage;
