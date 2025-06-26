import useFetch from "./useFetch";

export const useReservationsByBuildingAndDate = (buildingId, date) => {
  const endpoint =
    buildingId && date
      ? `/reservations/by-building/${buildingId}` // lo filtramos por fecha en el frontend
      : null;

  const { data, loading, error } = useFetch(endpoint);

  // filtramos por fecha en el frontend
  const filteredReservations = data?.filter((res) => res.date === date) || [];

  return { reservations: filteredReservations, loading, error };
};