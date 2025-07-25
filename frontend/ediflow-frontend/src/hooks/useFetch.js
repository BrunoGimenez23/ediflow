import { useEffect, useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const useFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token || !endpoint) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${res.statusText} - ${text}`);
        }
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData }; };

export default useFetch;
