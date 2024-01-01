import * as React from "react";
import { ViewStateChangeEvent, ViewState } from "react-map-gl";

export const useViewState = () => {
  const context = React.useContext(ViewStateContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
};

export const ViewStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [viewState, setViewState] = React.useState({
    longitude: 21,
    latitude: 52.23,
    zoom: 14,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const onMove = React.useCallback(({ viewState }: ViewStateChangeEvent) => {
    const newCenter = [viewState.longitude, viewState.latitude];
    // Only update the view state if the center is inside the geofence
    // if (turf.booleanPointInPolygon(newCenter, GEOFENCE)) {
    //   setViewState(newCenter);
    // }
    setViewState(viewState);
    // console.log("viewState", viewState);
  }, []);

  return (
    <ViewStateContext.Provider value={{ state: viewState, onChange: onMove }}>
      {children}
    </ViewStateContext.Provider>
  );
};

const ViewStateContext = React.createContext<
  | {
      state: ViewState;
      onChange: (e: ViewStateChangeEvent) => void;
    }
  | undefined
>(undefined);
