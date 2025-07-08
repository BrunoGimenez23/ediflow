import { useState } from "react";

const usePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = async (endpoint, payload) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };

      if (token && token.includes(".") && token.split(".").length === 3) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
  let errorData;
  const contentType = res.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    errorData = await res.json();
  } else {
    errorData = { message: await res.text() };
  }

 
  if (res.status === 403) {
    throw new Error(errorData.message || "Acceso denegado: no tienes permiso para realizar esta acción.");
  }

  throw new Error(errorData.message || `Error ${res.status}`);
}

      const contentType = res.headers.get("Content-Type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = {};
      }

      setLoading(false);
      return { data, error: null };

    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { data: null, error: err.message };
    }
  };

  return { post, loading, error };
};

export default usePost;
