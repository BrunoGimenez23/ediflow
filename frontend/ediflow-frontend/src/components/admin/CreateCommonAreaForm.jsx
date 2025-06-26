import React, { useState, useEffect } from "react";
import usePost from "../../hooks/usePost";
import usePut from "../../hooks/usePut";

const CreateCommonAreaForm = ({ onCreated, initialData }) => {
  const { post, loading: loadingPost, error: errorPost } = usePost();
  const { put, loading: loadingPut, error: errorPut } = usePut();

  const [form, setForm] = useState({
    name: "",
    description: "",
    capacity: "",
    buildingId: "",
  });

  // Al recibir initialData, cargarlo en el formulario
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        capacity: initialData.capacity || "",
        buildingId: initialData.buildingId || "",
      });
    } else {
      // Si no hay initialData, limpiar formulario
      setForm({
        name: "",
        description: "",
        capacity: "",
        buildingId: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.buildingId) {
      alert("Por favor completa el nombre y seleccioná un edificio.");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      capacity: form.capacity ? Number(form.capacity) : null,
      buildingId: Number(form.buildingId),
    };

    let res;
    if (initialData && initialData.id) {
      // Actualizar
      res = await put(`/common-areas/update/${initialData.id}`, payload);
    } else {
      // Crear nuevo
      res = await post("/common-areas/create", payload);
    }

    if (res) {
      alert(initialData ? "Área común actualizada con éxito!" : "Área común creada con éxito!");
      onCreated();
      // Limpiar solo si es creación, en edición el cierre ya lo hace el padre
      if (!initialData) {
        setForm({ name: "", description: "", capacity: "", buildingId: "" });
      }
    }
  };

  const loading = loadingPost || loadingPut;
  const error = errorPost || errorPut;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4"
    >
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "Editar Área Común" : "Crear Área Común"}
      </h2>

      <div>
        <label className="block mb-1 font-medium">Nombre</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Capacidad</label>
        <input
          type="number"
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          min={1}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">ID del Edificio</label>
        <input
          type="number"
          name="buildingId"
          value={form.buildingId}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
          min={1}
        />
        <p className="text-xs text-gray-500 mt-1">
          Ingresá el ID del edificio al que pertenece el área.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded text-white font-semibold ${
          loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? (initialData ? "Actualizando..." : "Creando...") : initialData ? "Actualizar" : "Crear Área Común"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
};

export default CreateCommonAreaForm;
