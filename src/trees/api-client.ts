import axios from "axios";
import { z } from "zod";

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

    const parsed = this.getCKANschema().parse(res.data);
    return parsed.result.total;
  };

  getTrees = async (limitPerRequest: number, offset: number) => {
    const urlWithParams = `${this.URL.toString()}&limit=${limitPerRequest}&offset=${offset}&sort=gatunek&fields=_id,x_wgs84,y_wgs84,gatunek`;

    const res = await axios({
      method: "get",
      url: urlWithParams,
    });

    const parsed = this.getCKANschema().parse(res.data);
    return parsed.result.records;
  };

  getTreeById = async (id: string) => {
    const urlWithParams = `${this.URL.toString()}&filters={"_id":"${id}"}`;

    const res = await axios({
      method: "get",
      url: urlWithParams,
    });

    const parsed = this.getCKANschema().parse(res.data);
    return parsed.result.records[0];
  };

  private getCKANschema = () => {
    return z.object({
      result: z.object({
        include_total: z.boolean(),
        resource_id: z.string(),
        fields: z.array(z.object({ type: z.string(), id: z.string() })),
        records_format: z.string().optional(),
        q: z.string().optional(),
        records: z.array(this.getRecordSchema()),
        limit: z.number(),
        offset: z.number().optional(),
        _links: z.object({
          start: z.string(),
          prev: z.string().optional(),
          next: z.string(),
        }),
        total: z.number(),
      }),
    });
  };

  private getRecordSchema = () => {
    return z.object({
      _id: z.number(),
      x_wgs84: z.number().optional(),
      y_wgs84: z.number().optional(),
      x_pl2000: z.number().optional(),
      y_pl2000: z.number().optional(),
      numer_inw: z.string().optional(),
      dzielnica: z.string().optional(),
      jednostka: z.string().optional(),
      miasto: z.string().optional(),
      adres: z.string().optional(),
      numer_adres: z.string().optional(),
      lokalizacja: z.string().optional(),
      gatunek: z.string().optional(),
      gatunek_1: z.string().optional(),
      data_wyk_pom: z.number().optional(),
      wiek_w_dni: z.number().optional(),
      wysokosc: z.string().optional(),
      pnie_obwod: z.string().optional(),
      srednica_k: z.string().optional(),
      stan_zdrowia: z.string().optional(),
    });
  };
}
