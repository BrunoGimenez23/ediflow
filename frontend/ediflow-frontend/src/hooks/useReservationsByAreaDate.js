import useFetch from "./useFetch";

export const useReservationsByAreaDate = (commonAreaId, date) => {
  const endpoint =
    commonAreaId && date
      ? `/reservations/by-area/${commonAreaId}?date=${date}`
      : null;

  const { data, loading, error } = useFetch(endpoint);

  return {
    reservations: data || [],
    loading,
    error,
  };
};
