import * as React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Layer } from "react-map-gl";
import type { CircleLayer } from "react-map-gl";
import type { FeatureCollection } from "geojson";

import "mapbox-gl/dist/mapbox-gl.css";

import { MapboxMap, MapboxGeojsonSource } from "./libs/mapbox-map";

const layerStyle: CircleLayer = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 10,
    "circle-color": "red",
  },
};

const layerStyle_2: CircleLayer = {
  id: "point_2",
  type: "circle",
  paint: {
    "circle-radius": 10,
    "circle-color": "black",
  },
};

const baseURL = "http://localhost:8088";
const resourcePath = `/api/3/action/datastore_search/?resource_id=ed6217dd-c8d0-4f7b-8bed-3b7eb81a95ba`;
const url = `${baseURL}${resourcePath}`;

const getItemsTotal = async (url: string) => {
  const limit = 0;
  const res = await axios({
    method: "get",
    url: `${url}&limit=${limit}&fields=_id`,
  });

  const { total } = res.data.result;
  return total;
};

const getItems = async ({
  limitPerRequest,
  offset,
}: {
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

const calculateQueriesCount = (total: number, limitPerRequest: number) => {
  if (!total) return 0;

  const count = Math.ceil(total / limitPerRequest);
  return count;
};

const TreesGeojsonSources = () => {
  const limitPerRequest = 10_000;

  const { data: totalNumberOfItems, isLoading } = useQuery({
    queryKey: ["getItemsTotal"],
    queryFn: () => getItemsTotal(url),
  });
  // console.log("totalNumberOfItems", totalNumberOfItems);

  const queriesCount = calculateQueriesCount(
    totalNumberOfItems,
    limitPerRequest,
  );
  // console.log("queriesCount", queriesCount);

  console.log("TreesGeojsonSource");

  return (
    <>
      {new Array(2).fill(null).map((_, index) => {
        return (
          <PartialTreesGeojsonSource key={String(index)} batchNumber={index}>
            <Layer {...layerStyle} />
          </PartialTreesGeojsonSource>
        );
      })}
    </>
  );
};

type PartialTreesGeojsonSourceProps = {
  batchNumber: number;
  children: React.ReactNode;
};

export const PartialTreesGeojsonSource = ({
  batchNumber,
  children,
}: PartialTreesGeojsonSourceProps) => {
  const limitPerRequest = 10_000;

  const { data, isLoading } = useQuery({
    queryKey: ["getItems", batchNumber],
    queryFn: () =>
      getItems({ limitPerRequest, offset: batchNumber * limitPerRequest }),
  });

  if (!data) return null;

  const geojson = toGeoJSON(data);

  return (
    <MapboxGeojsonSource id={String(batchNumber)} geojson={geojson}>
      {children}
    </MapboxGeojsonSource>
  );
};

export const App = () => {
  return (
    <MapboxMap>
      <TreesGeojsonSources />
    </MapboxMap>
  );
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

const geojson_1: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [21.094936, 52.235348] },
      properties: {},
    },
  ],
};

const geojson_2: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [21.044879, 52.181564] },
      properties: {},
    },
  ],
};
