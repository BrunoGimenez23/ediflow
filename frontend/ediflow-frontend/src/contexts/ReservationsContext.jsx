import { createContext, useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import usePost from "../hooks/usePost";
import useDelete from "../hooks/useDelete";
import { useAuth } from "./AuthContext";

const ReservationsContext = createContext();

export const ReservationsProvider = ({ children }) => {
  const { user } = useAuth();

 
  const endpoint = user?.role === "ADMIN" ? "/reservations/all" : user ? "/reservations/my-reservations" : null;

  const { data, loading, error } = useFetch(endpoint);
  const { post, loading: loadingPost, error: errorPost } = usePost();
  const { remove, loading: loadingDelete, error: errorDelete } = useDelete();

  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (data) setReservations(data);
  }, [data]);

  const refreshReservations = async () => {
    if (!user) return;

    const refreshEndpoint = user.role === "ADMIN" ? "/reservations/all" : "/reservations/my-reservations";

    const res = await fetch(`${import.meta.env.VITE_API_URL}${refreshEndpoint}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (res.ok) {
      const json = await res.json();
      setReservations(json);
    }
  };

  const createReservation = async (reservationData) => {
    if (user?.role !== "RESIDENT") {
      alert("Solo residentes pueden crear reservas.");
      return false;
    }
    const newReservation = await post("/reservations/create", reservationData);
    if (newReservation) {
      await refreshReservations();
      return true;
    }
    return false;
  };

  const deleteReservation = async (id) => {
    if (user?.role !== "RESIDENT") {
      alert("Solo residentes pueden eliminar reservas.");
      return false;
    }
    const res = await remove(`/reservations/delete/${id}`);
    if (res) {
      await refreshReservations();
      return true;
    }
    return false;
  };

  return (
    <ReservationsContext.Provider
      value={{
        reservations,
        loading,
        error,
        createReservation,
        loadingPost,
        errorPost,
        deleteReservation,
        loadingDelete,
        errorDelete,
        refreshReservations,
      }}
    >
      {children}
    </ReservationsContext.Provider>
  );
};

export const useReservations = () => useContext(ReservationsContext);
