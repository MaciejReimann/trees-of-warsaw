import { HStack, Box } from "@chakra-ui/react";
import { MapboxMap } from "./libs/mapbox/mapbox-map";
import { ViewStateProvider } from "./libs/mapbox/mapox-view-state.provider";
import { TreesGeojsonSources } from "./trees/geojson-sources";
import { SpeciesPanel } from "./trees/species.panel";

type AppProps = {
  children?: React.ReactNode;
};

export const App = ({ children }: AppProps) => {
  return (
    <ViewStateProvider>
      <HStack spacing={1} height={"100vh"}>
        <SpeciesPanel w="25vw" overflowY="auto" maxHeight="100vh" />

        <Box width="100vw" height="100vh">
          <MapboxMap>
            <TreesGeojsonSources />
          </MapboxMap>
        </Box>
      </HStack>
      {children}
    </ViewStateProvider>
  );
};
