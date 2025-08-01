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
        let errorMessage = `Error ${res.status}`;
        try {
          const errorData = await res.json(); 
          errorMessage = errorData.message || errorMessage;
        } catch {
          
        }
        throw new Error(errorMessage);
      }

    
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await res.json();
      }

      return true;
    } catch (err) {
      setError(err.message || "Ocurrió un error al eliminar");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
};

export default useDelete;
