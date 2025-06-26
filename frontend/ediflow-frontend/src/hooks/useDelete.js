import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const useDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const remove = async (endpoint) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${res.statusText} - ${text}`);
      }

      // Si devuelve JSON:
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await res.json();
      }

      return true; // en caso de no devolver contenido JSON
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
};

export default useDelete;
