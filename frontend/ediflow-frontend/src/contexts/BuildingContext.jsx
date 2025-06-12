import { createContext, useContext } from "react";
import useFetch from "../hooks/useFetch";

const BuildingContext = createContext();

const manualToken = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX0FETUlOIl0sInN1YiI6ImFkbWluMUBleGFtcGxlLmNvbSIsImlhdCI6MTc0OTY4NDgzMywiZXhwIjoxNzQ5NzcxMjMzfQ.3-XkcrjI9I5hAJJIL9d-efxgLUj645bkIWhQNFbyMmE";

export const BuildingProvider = ({ children }) => {
  const { data, loading, error } = useFetch("/buildings", manualToken);

  const buildings = data || [];

  console.log("Buildings from context:", buildings);

  return (
    <BuildingContext.Provider value={{ buildings, loading, error }}>
      {children}
    </BuildingContext.Provider>
  );
};

export default BuildingProvider;

export const useBuildingsContext = () => useContext(BuildingContext);
