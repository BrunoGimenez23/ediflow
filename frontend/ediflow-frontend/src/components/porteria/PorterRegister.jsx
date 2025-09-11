import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const PorterRegister = () => {
  const { user, token, logout } = useAuth(); // <-- traemos token directamente
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: "PAQUETE",
    description: "",
    residentId: "",
  });

  const buildingId = user?.buildingId;

  useEffect(() => {
    if (!buildingId) {
      toast.error("No hay edificio asignado al portero");
      return;
    }

    const fetchResidents = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/residents/by-building-porter/${buildingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // <-- usamos token directamente
            },
          }
        );

        if (!res.ok) throw new Error("Error al cargar residentes");

        const data = await res.json();
        setResidents(data);
      } catch (err) {
        console.error(err);
        toast.error("Error cargando residentes");
      }
    };

    fetchResidents();
  }, [buildingId, token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { residentId, type, description } = form;

    if (!residentId) {
      toast.error("Selecciona un residente");
      setLoading(false);
      return;
    }

    const promise = axios.post(
      `${import.meta.env.VITE_API_URL}/log-entries`,
      { residentId, type, description },
      {
        headers: {
          Authorization: `Bearer ${token}`, // <-- token usado aquí también
        },
      }
    );

    toast.promise(promise, {
      loading: "Registrando...",
      success: "Registro creado correctamente 🎉",
      error: "Error al registrar ❌",
    });

    try {
      await promise;
      setForm({ type: "PAQUETE", description: "", residentId: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 space-y-4 max-w-md mx-auto">
      <div className="flex justify-end">
        <button
          onClick={logout}
          className="bg-red-600 text-white rounded px-3 py-1 hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </div>

      <h2 className="text-lg font-semibold">Registrar evento</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="PAQUETE">Paquete</option>
          <option value="VISITA">Visita</option>
          <option value="OTRO">Otro</option>
        </select>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full border rounded p-2"
        />

        <select
          name="residentId"
          value={form.residentId}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">Seleccionar residente</option>
          {residents.length > 0 ? (
            residents.map((r) => (
              <option key={r.id} value={r.id}>
                {r.userDTO?.username || "Residente sin nombre"}
              </option>
            ))
          ) : (
            <option disabled>No hay residentes</option>
          )}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
};

export default PorterRegister;
