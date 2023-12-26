import axios from "axios";
import { useQuery, useQueries } from "@tanstack/react-query";

type Tree = any;

export const useTreesTotal = () => {
  const result = useQuery({
    queryKey: ["getTreesTotal"],
    queryFn: () => getTreesTotal(),
  });

  return result;
};

export const useTrees = ({
  limitPerRequest,
  total,
}: {
  limitPerRequest: number;
  total: number;
}) => {
  const result = useTreesQueries({ limitPerRequest, total });

  return result;
};

export const useTreeById = ({ id }: { id: string }) => {
  const result = useQuery({
    queryKey: ["getTreeById", id],
    queryFn: () => getTreeById({ id }),
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
    queries: new Array(queriesCount).fill(null).map((_, index) => ({
      queryKey: ["getTrees", index],
      queryFn: () =>
        getTrees({
          limitPerRequest,
          offset: index * limitPerRequest,
        }),
      select,
    })),
  });

  return results;
};

const baseURL = "http://localhost:8088";
const resourcePath = `/api/3/action/datastore_search/?resource_id=ed6217dd-c8d0-4f7b-8bed-3b7eb81a95ba`;
const treesURL = new URL(`${baseURL}${resourcePath}`);

const getTreesTotal = async (url: URL = treesURL) => {
  const limit = 0;
  const res = await axios({
    method: "get",
    url: `${url.toString()}&limit=${limit}&fields=_id`,
  });

  const { total } = res.data.result;
  return total;
};

const getTrees = async ({
  url = treesURL,
  limitPerRequest,
  offset,
}: {
  url?: URL;
  limitPerRequest: number;
  offset: number;
}) => {
  const urlWithParams = `${url}&limit=${limitPerRequest}&offset=${offset}&sort=gatunek&fields=_id,x_wgs84,y_wgs84,gatunek`;

  const res = await axios({
    method: "get",
    url: urlWithParams,
  });

  const records = res.data.result.records;
  return records;
};

export const getTreeById = async ({
  url = treesURL,
  id,
}: {
  url?: URL;
  id: string;
}) => {
  const urlWithParams = `${url}&filters={"_id":"${id}"}`;

  const res = await axios({
    method: "get",
    url: urlWithParams,
  });

  const records = res.data.result.records;
  return records;
};
