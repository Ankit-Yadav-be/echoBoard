import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from './context/SocketContext';
import { ProjectProvider } from "./context/ProjectContext.jsx";
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const theme = extendTheme({ colors });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
    <ProjectProvider>
        <BrowserRouter>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
    </BrowserRouter>
    </ProjectProvider>
    </SocketProvider>
  </StrictMode>
);
