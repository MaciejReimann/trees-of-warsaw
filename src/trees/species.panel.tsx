import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  StackDivider,
  Stack,
  Box,
  BoxProps,
  Text,
} from "@chakra-ui/react";

import { useTreesTotal, useTreeSpecies } from "./use.trees";

type SpeciesPanelProps = {} & BoxProps;

export const SpeciesPanel = ({ ...props }: SpeciesPanelProps) => {
  const limitPerRequest = 10_000;

  const { data: totalNumberOfTrees } = useTreesTotal();

  const queriesResults = useTreeSpecies({
    limitPerRequest,
    total: totalNumberOfTrees ?? 0,
  });

  return (
    <Box p={5} shadow="md" borderWidth="1px" {...props}>
      <Heading fontSize="xl">Species</Heading>

      <>
        {queriesResults.map((result, index) => {
          if (result.isLoading) {
            return <Text mt={4}>Loading...</Text>;
          }
          if (result.isError) {
            return <Text mt={4}>Error</Text>;
          }
          if (!result.data) {
            return <Text mt={4}>No data</Text>;
          }
          return result.data.map((item) => <Text mt={4}>{item}</Text>);
        })}
      </>
    </Box>
  );
};
