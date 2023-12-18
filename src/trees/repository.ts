import axios from "axios";

const baseURL = "http://localhost:8088";
const resourcePath = `/api/3/action/datastore_search/?resource_id=ed6217dd-c8d0-4f7b-8bed-3b7eb81a95ba`;
const treesURL = new URL(`${baseURL}${resourcePath}`);

export const getItemsTotal = async (url: URL = treesURL) => {
  const limit = 0;
  const res = await axios({
    method: "get",
    url: `${url.toString()}&limit=${limit}&fields=_id`,
  });

  const { total } = res.data.result;
  return total;
};

export const getItems = async ({
  url = treesURL,
  limitPerRequest,
  offset,
}: {
  url?: URL;
  limitPerRequest: number;
  offset: number;
}) => {
  const urlWithParams = `${url}&limit=${limitPerRequest}&offset=${offset}&sort=x_wgs84,y_wgs84&fields=_id,x_wgs84,y_wgs84`;

  const res = await axios({
    method: "get",
    url: urlWithParams,
  });

  const records = res.data.result.records;
  return records;
};
