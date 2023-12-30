import { useQuery, useQueries } from "@tanstack/react-query";
import type { FeatureCollection } from "geojson";

import { TreesApiClient } from "./api-client";

type Tree = any;

const apiClient = new TreesApiClient();

export const useTreesTotal = () => {
  const result = useQuery({
    queryKey: ["getTreesTotal"],
    queryFn: () => apiClient.getTreesTotal(),
  });

  return result;
};

const toGeoJSON = (
  items: { x_wgs84: number; y_wgs84: number }[],
): FeatureCollection => {
  return {
    type: "FeatureCollection",
    features: items.map((item) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [item.x_wgs84, item.y_wgs84] },
      properties: { ...item },
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

const filterSpecies = (trees: { gatunek: string }[]) => {
  const species = trees.map((tree) => tree.gatunek);

  return Array.from(new Set(species));
};

export const useTreeSpecies = ({
  limitPerRequest,
  total,
}: {
  limitPerRequest: number;
  total: number;
}) => {
  const results = useTreesQueries({ limitPerRequest, total }, filterSpecies);

  return results;
};

const calculateQueriesCount = (total: number, limitPerRequest: number) => {
  if (!total) return 0;

  const count = Math.ceil(total / limitPerRequest);
  return count;
};

const useTreesQueries = <TData = Tree>(
  {
    limitPerRequest,
    total,
  }: {
    limitPerRequest: number;
    total: number;
  },
  select?: (data: Tree) => TData,
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
