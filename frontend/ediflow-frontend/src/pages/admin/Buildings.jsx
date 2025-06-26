import { useState } from "react";
import { useBuildingsContext } from "../../contexts/BuildingContext";
import usePost from "../../hooks/usePost";
import usePut from "../../hooks/usePut";
import useDelete from "../../hooks/useDelete";
import { useAuth } from "../../contexts/AuthContext";

const Buildings = () => {
  const { buildings, loading, error, fetchBuildings } = useBuildingsContext();
  const { post, loading: loadingPost, error: errorPost } = usePost();
  const { put, loading: loadingPut, error: errorPut } = usePut();
  const { remove, loading: loadingDelete, error: errorDelete } = useDelete();
  const { user } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [editingBuilding, setEditingBuilding] = useState(null);

  const handleAddOrUpdateBuilding = async (e) => {
    e.preventDefault();

    if (!user || !user.adminId) {
      console.error("No hay adminId en el usuario logueado");
      return;
    }

    const payload = {
      name,
      address,
      adminId: user.adminId,
    };

    let res;
    if (editingBuilding) {
      // EDITAR
      res = await put(`/buildings/update/${editingBuilding.id}`, payload);
    } else {
      // CREAR
      res = await post("/buildings/building", payload);
    }

    if (res) {
      await fetchBuildings();
      setName("");
      setAddress("");
      setShowForm(false);
      setEditingBuilding(null);
    }
  };

  const handleDeleteBuilding = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que querés eliminar este edificio?");
    if (!confirmDelete) return;

    const res = await remove(`/buildings/delete/${id}`);
    if (res) {
      await fetchBuildings();
    }
  };

  if (loading) return <p className="text-center">Cargando edificios...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Edificios</h1>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">

        {/* Botón mostrar/ocultar formulario */}
        <div className="mb-6 text-right">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingBuilding(null); // salir del modo edición si estaba
              setName("");
              setAddress("");
            }}
            className="bg-ediblue text-white px-4 py-2 rounded hover:bg-ediblueLight transition"
          >
            {showForm ? "Cancelar" : "Agregar edificio"}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <form onSubmit={handleAddOrUpdateBuilding} className="mb-6 space-y-4">
            <input
              type="text"
              placeholder="Nombre del edificio"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Dirección"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loadingPost || loadingPut}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                {editingBuilding ? "Actualizar edificio" : "Guardar edificio"}
              </button>
              {editingBuilding && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingBuilding(null);
                    setName("");
                    setAddress("");
                    setShowForm(false);
                  }}
                  className="text-gray-500 hover:underline"
                >
                  Cancelar edición
                </button>
              )}
            </div>
            {(errorPost || errorPut) && <p className="text-red-500 text-sm">{errorPost || errorPut}</p>}
          </form>
        )}

        {/* Tabla */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">
            {editingBuilding ? "Editando Edificio" : "Lista de Edificios"}
          </h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Nombre</th>
                <th className="py-2 px-4 border-b">Ubicación</th>
                <th className="py-2 px-4 border-b">Residentes</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {buildings.map((building) => (
                <tr key={building.id}>
                  <td className="py-2 px-4 border-b">{building.id}</td>
                  <td className="py-2 px-4 border-b">{building.name}</td>
                  <td className="py-2 px-4 border-b">{building.address}</td>
                  <td className="py-2 px-4 border-b">{building.residentCount}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => {
                        setEditingBuilding(building);
                        setName(building.name);
                        setAddress(building.address);
                        setShowForm(true);
                      }}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteBuilding(building.id)}
                      disabled={loadingDelete}
                      className="text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                    {errorDelete && <p className="text-red-500 text-sm">{errorDelete}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Buildings;
