import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const usePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = async (endpoint, payload) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text(); // para debugging
        throw new Error(`Error ${res.status}: ${text}`);
      }

      const contentType = res.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        return data;
      } else {
        // No content or plain text
        return {};
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { post, loading, error };
};

export default usePost;