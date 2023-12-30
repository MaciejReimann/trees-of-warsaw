import axios from "axios";

const defaults = {
  baseURL: "http://localhost:8088",
  resourcePath: `/api/3/action/datastore_search/?resource_id=ed6217dd-c8d0-4f7b-8bed-3b7eb81a95ba`,
};

abstract class ApiClient {
  protected readonly URL: URL;

  constructor(host: string, path: string) {
    this.URL = new URL(`${host}${path}`);
  }
}

export class TreesApiClient extends ApiClient {
  constructor(
    host: string = defaults.baseURL,
    path: string = defaults.resourcePath,
  ) {
    super(host, path);
  }

  getTreesTotal = async () => {
    const limit = 0;
    const res = await axios({
      method: "get",
      url: `${this.URL.toString()}&limit=${limit}&fields=_id`,
    });

    const { total } = res.data.result;
    return total;
  };

  getTrees = async (limitPerRequest: number, offset: number) => {
    const urlWithParams = `${this.URL.toString()}&limit=${limitPerRequest}&offset=${offset}&sort=gatunek&fields=_id,x_wgs84,y_wgs84,gatunek`;

    const res = await axios({
      method: "get",
      url: urlWithParams,
    });

    const records = res.data.result.records;
    return records;
  };

  getTreeById = async (id: string) => {
    const urlWithParams = `${this.URL.toString()}&filters={"_id":"${id}"}`;

    const res = await axios({
      method: "get",
      url: urlWithParams,
    });

    const records = res.data.result.records;
    return records;
  };
}
