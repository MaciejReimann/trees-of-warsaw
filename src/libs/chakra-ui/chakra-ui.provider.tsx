import * as React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    button: {
      blue: "#4066bd",
    },
    background: {
      white: "#fff",
      grey: "#f5f5f6",
      darkGrey: "#151a2f",
    },
    text: {
      white: "#fff",
      grey: "#59666d",
      darkGrey: "#151a2f",
      black: "#1a1f32",
    },
    icon: {
      yellow: "#f8d03a",
    },
  },
});

interface CustomizedChakraProviderProps {
  children: React.ReactNode;
}

export const ChakraUIProvider = ({
  children,
}: CustomizedChakraProviderProps) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
