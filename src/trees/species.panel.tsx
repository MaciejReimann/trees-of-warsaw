import {
  Heading,
  Stack,
  Box,
  BoxProps,
  Text,
  Checkbox,
} from "@chakra-ui/react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "../router";

import { NestedCheckboxesWithRouter } from "./components/nested-checkboxes.with-router";
import { useTreesTotal, useTreeSpecies } from "./use.trees";

type SpeciesPanelProps = {} & BoxProps;

export const SpeciesPanel = ({ ...props }: SpeciesPanelProps) => {
  const limitPerRequest = 10_000;
  //   const limitPerRequest = 10;

  const { data: totalNumberOfTrees } = useTreesTotal();

  const queriesResults = useTreeSpecies({
    limitPerRequest,
    total: totalNumberOfTrees ?? 0,
  });

  const searchParams = useSearch({
    from: rootRoute.id,
  });

  console.log("searchParams", searchParams);

  return (
    <Box p={5} shadow="md" borderWidth="1px" {...props}>
      <Heading fontSize="xl">Species</Heading>

      <>
        {queriesResults.map((result, index) => {
          //   if (result.isLoading) {
          //     return <Text mt={4}>Loading...</Text>;
          //   }
          //   if (result.isError) {
          //     return <Text mt={4}>Error</Text>;f
          //   }
          if (!result.data) {
            return (
              <Text key={index} mt={4}>
                No data
              </Text>
            );
          }
          const genera = result.data;
          const key = JSON.stringify(genera[0]);

          // console.log(result.data);

          return (
            <Stack spacing={[1, 5]} direction={["column"]} key={key}>
              {genera.map((genus) => {
                return (
                  <NestedCheckboxesWithRouter
                    key={genus.name + index}
                    parentValue={genus.name}
                    childValues={genus.species.map((species) => species.name)}
                  />
                );
              })}
            </Stack>
          );
        })}
      </>
    </Box>
  );
};
