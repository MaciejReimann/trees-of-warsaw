import React from "react";
import ReactDOM from "react-dom/client";

import { ChakraUIProvider } from "./libs/chakra-ui/chakra-ui.provider";
import { QueryClientProvider } from "./libs/tanstack-query/query-client.provider";
import { TanstackRouterProvider } from "./router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraUIProvider>
      <QueryClientProvider>
        <TanstackRouterProvider />
      </QueryClientProvider>
    </ChakraUIProvider>
  </React.StrictMode>,
);
