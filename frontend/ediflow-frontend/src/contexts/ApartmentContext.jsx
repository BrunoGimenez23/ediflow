import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export const ApartmentContext = createContext();

export const ApartmentProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [apartments, setApartments] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("");
  const [buildingIdFilter, setBuildingIdFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApartments = async (
    customPage = page,
    customFilter = filter,
    customBuildingId = buildingIdFilter
  ) => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const url =
        user.role === "RESIDENT"
          ? `${import.meta.env.VITE_API_URL}/apartment/me`
          : `${import.meta.env.VITE_API_URL}/apartment/paged?buildingId=${customBuildingId}&filter=${encodeURIComponent(
              customFilter
            )}&page=${customPage}&size=10`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener apartamentos");

      const data = await res.json();
      

      if (user.role === "RESIDENT") {
        setApartments([data]);
        setTotalPages(1);
        setTotalElements(1);
        setPage(0);
      } else {
        setApartments(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setPage(customPage);
      }
    } catch (err) {
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchApartments(page, filter, buildingIdFilter);
  }, [user, page, filter, buildingIdFilter]);

  return (
    <ApartmentContext.Provider
      value={{
        apartments,
        setApartments,
        loading,
        error,
        fetchApartments,
        page,
        setPage,
        totalPages,
        totalElements,
        filter,
        setFilter,
        buildingIdFilter,
        setBuildingIdFilter,
      }}
    >
      {children}
    </ApartmentContext.Provider>
  );
};

export const useApartmentContext = () => useContext(ApartmentContext);
