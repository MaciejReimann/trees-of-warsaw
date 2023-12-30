import React from "react";
import ReactDOM from "react-dom/client";

import { ChakraUIProvider } from "./libs/chakra-ui/chakra-ui.provider";
import { QueryClientProvider } from "./libs/react-query/query-client.provider";
import { App } from "./app";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraUIProvider>
      <QueryClientProvider>
        <App />
      </QueryClientProvider>
    </ChakraUIProvider>
  </React.StrictMode>,
);
