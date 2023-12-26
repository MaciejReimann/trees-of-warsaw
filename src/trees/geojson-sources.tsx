import type { FeatureCollection } from "geojson";

import { MapboxGeojsonSource } from "../libs/mapbox-geojson-source";
import {
  useTreesCount,
  useTrees,
  useTreeById,
  useTreeSpecies,
} from "./use.trees";

const calculateQueriesCount = (total: number, limitPerRequest: number) => {
  if (!total) return 0;

  const count = Math.ceil(total / limitPerRequest);
  return count;
};

export const TreesGeojsonSources = () => {
  const limitPerRequest = 20_000;

  const { data: totalNumberOfItems, isLoading } = useTreesCount();

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
          />
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
  const { data, isLoading } = useTrees({
    limitPerRequest,
    batchNumber,
  });

  if (!data) return null;

  const geojson = toGeoJSON(data);

  return (
    <MapboxGeojsonSource
      id={String(batchNumber)}
      geojson={geojson}
      renderPopupContent={(id) => (
        <>
          <TreeDetails id={id} />
        </>
      )}
    ></MapboxGeojsonSource>
  );
};

interface TreeDetailsProps {
  id: string;
}

const TreeDetails = ({ id }: TreeDetailsProps) => {
  const { data, isLoading } = useTreeById({ id });

  if (isLoading) return <>Loading...</>;

  const details = JSON.stringify(data, null, 2);

  return <>{details}</>;
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

export const FiltersPanel = () => {
  const limitPerRequest = 20_000;

  const { data: treesCount } = useTreesCount();

  const { data, isLoading } = useTreeSpecies({
    limitPerRequest,
    batchNumber: 0,
  });

  console.log("species", data);

  return (
    <div style={{ position: "absolute", top: 100 }}>
      Filter by species
      <>{data}</>
    </div>
  );
};
