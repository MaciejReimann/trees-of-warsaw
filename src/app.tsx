import { HStack, Box } from "@chakra-ui/react";
import { MapboxMap } from "./libs/mapbox-map";
import { ViewStateProvider } from "./libs/mapox-view-state.provider";
import { TreesGeojsonSources } from "./trees/geojson-sources";
import { SpeciesPanel } from "./trees/species.panel";

export const App = () => {
  return (
    <ViewStateProvider>
      <HStack spacing={1} position={"absolute"}>
        <SpeciesPanel w="20vw" />

        <Box>
          "Hello World"
          {/* <MapboxMap>
          <TreesGeojsonSources />
        </MapboxMap> */}
        </Box>
      </HStack>
    </ViewStateProvider>
  );
};
