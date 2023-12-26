import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type Tree = any;

export const useTreesCount = () => {
  const result = useQuery({
    queryKey: ["getTreesTotal"],
    queryFn: () => getTreesTotal(),
  });

  return result;
};

export const useTrees = ({
  limitPerRequest,
  batchNumber,
}: {
  limitPerRequest: number;
  batchNumber: number;
}) => {
  const result = useTreesQuery({ limitPerRequest, batchNumber });

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
  batchNumber,
}: {
  limitPerRequest: number;
  batchNumber: number;
}) => {
  const result = useTreesQuery({ limitPerRequest, batchNumber }, filterSpecies);

  return result;
};

const useTreesQuery = <TData = Tree>(
  {
    limitPerRequest,
    batchNumber,
  }: {
    limitPerRequest: number;
    batchNumber: number;
  },
  select?: (data: Tree) => TData,
) => {
  const offset = batchNumber * limitPerRequest;
  const result = useQuery({
    queryKey: ["getTrees", offset],
    queryFn: () => getTrees({ limitPerRequest, offset }),
    select,
  });

  return result;
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
