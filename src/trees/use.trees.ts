import { useQuery, useQueries } from "@tanstack/react-query";
import type { FeatureCollection } from "geojson";
import { groupBy } from "lodash";

import { TreesApiClient, TreeRecord } from "./api-client";
import { stringToColorCode } from "./utils";

const apiClient = new TreesApiClient();

export const useTreesTotal = () => {
  const result = useQuery({
    queryKey: ["getTreesTotal"],
    queryFn: () => apiClient.getTreesTotal(),
  });

  return result;
};

const toGeoJSON = (items: TreeRecord[]): FeatureCollection => {
  return {
    type: "FeatureCollection",
    features: items.map((item) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [item.x_wgs84, item.y_wgs84] },
      properties: { ...item, color: stringToColorCode(item.gatunek ?? "") },
    })),
  };
};

export const useTreesGeoJSON = ({
  limitPerRequest,
  total,
}: {
  limitPerRequest: number;
  total: number;
}) => {
  const result = useTreesQueries({ limitPerRequest, total }, toGeoJSON);

  return result;
};

export const useTreeById = (id: string) => {
  const result = useQuery({
    queryKey: ["getTreeById", id],
    queryFn: () => apiClient.getTreeById(id),
  });

  return result;
};

class Species {
  constructor(public name: string, public trees: { id: number }[]) {}
}

class Genus {
  constructor(public name: string, public species: Species[]) {}
}

// assuming the records are sorted by species name
const createGenera = (trees: TreeRecord[]) => {
  const groupedByGenera = groupBy(trees, (tree) => tree.gatunek?.split(" ")[0]);

  return Object.entries(groupedByGenera).reduce((acc, [genusName, trees]) => {
    const groupedBySpecies = groupBy(trees, (tree) => tree.gatunek);

    const species = Object.entries(groupedBySpecies).reduce(
      (acc, [speciesName, trees]) => {
        const IDs = trees.map((tree) => ({ id: tree._id }));
        const species = new Species(speciesName, IDs);

        return [...acc, species];
      },
      [] as Species[],
    );

    const genus = new Genus(genusName, species);

    if (!genus) return acc;

    return [...acc, genus];
  }, [] as Genus[]);
};

export const useTreeSpecies = ({
  limitPerRequest,
  total,
}: {
  limitPerRequest: number;
  total: number;
}) => {
  const results = useTreesQueries({ limitPerRequest, total }, createGenera);

  return results;
};

const calculateQueriesCount = (total: number, limitPerRequest: number) => {
  if (!total) return 0;

  const count = Math.ceil(total / limitPerRequest);
  return count;
};

const useTreesQueries = <TData = TreeRecord[]>(
  {
    limitPerRequest,
    total,
  }: {
    limitPerRequest: number;
    total: number;
  },
  select?: (data: TreeRecord[]) => TData,
) => {
  const queriesCount = calculateQueriesCount(total, limitPerRequest);

  const results = useQueries({
    queries: new Array(queriesCount).fill(null).map((_, index) => {
      const offset = index * limitPerRequest;

      return {
        queryKey: ["getTrees", index],
        queryFn: () => apiClient.getTrees(limitPerRequest, offset),
        select,
      };
    }),
  });

  return results;
};
