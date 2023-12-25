import { useQuery } from "@tanstack/react-query";
import type { FeatureCollection } from "geojson";

import { MapboxGeojsonSource } from "../libs/mapbox-map";
import { getItems, getItemsTotal } from "./repository";

const calculateQueriesCount = (total: number, limitPerRequest: number) => {
  if (!total) return 0;

  const count = Math.ceil(total / limitPerRequest);
  return count;
};

export const TreesGeojsonSources = () => {
  const limitPerRequest = 20_000;

  const { data: totalNumberOfItems, isLoading } = useQuery({
    queryKey: ["getItemsTotal"],
    queryFn: () => getItemsTotal(),
  });

  const queriesCount = calculateQueriesCount(
    totalNumberOfItems,
    limitPerRequest,
  );

  return (
    <>
      {new Array(queriesCount).fill(null).map((_, index) => {
        return (
          <PartialTreesGeojsonSource
            key={String(index)}
            batchNumber={index}
            limitPerRequest={limitPerRequest}
          ></PartialTreesGeojsonSource>
        );
      })}
    </>
  );
};

type PartialTreesGeojsonSourceProps = {
  batchNumber: number;
  limitPerRequest: number;
  children?: React.ReactNode;
};

const PartialTreesGeojsonSource = ({
  batchNumber,
  limitPerRequest,
}: PartialTreesGeojsonSourceProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["getItems", batchNumber],
    queryFn: () =>
      getItems({ limitPerRequest, offset: batchNumber * limitPerRequest }),
  });

  if (!data) return null;

  const geojson = toGeoJSON(data);

  return (
    <MapboxGeojsonSource
      id={String(batchNumber)}
      geojson={geojson}
    ></MapboxGeojsonSource>
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
