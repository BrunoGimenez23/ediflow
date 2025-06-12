import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const manualToken = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX0FETUlOIl0sInN1YiI6ImFkbWluMUBleGFtcGxlLmNvbSIsImlhdCI6MTc0OTY4NDgzMywiZXhwIjoxNzQ5NzcxMjMzfQ.3-XkcrjI9I5hAJJIL9d-efxgLUj645bkIWhQNFbyMmE";

export const useFetch = (endpoint, manualToken) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Si te pasan un token hardcodeado, usalo. Sino trata de buscar en localStorage.
  const token = manualToken || localStorage.getItem("token");

  useEffect(() => {
  if (!token) {
    setError("No token found");
    setLoading(false);
    return;
  }

  console.log("Enviando token:", token);

  fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
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
}, [endpoint, token]);
  return { data, loading, error };
};

export default useFetch;
