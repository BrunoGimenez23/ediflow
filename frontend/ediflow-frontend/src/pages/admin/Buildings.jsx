import { useState, useEffect } from "react";
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
  const { user, trialExpired } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [editingBuilding, setEditingBuilding] = useState(null);

  // 🔐 Esperar hasta que user esté disponible antes de fetchBuildings
  useEffect(() => {
    if (user?.adminId) {
      fetchBuildings();
    }
  }, [user, fetchBuildings]);

  const handleAddOrUpdateBuilding = async (e) => {
    e.preventDefault();

    if (trialExpired) {
      alert("Tu prueba gratuita ha finalizado. Por favor, activa un plan para continuar.");
      return;
    }

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
      res = await put(`/buildings/update/${editingBuilding.id}`, payload);
    } else {
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
    if (trialExpired) {
      alert("Tu prueba gratuita ha finalizado. Por favor, activa un plan para continuar.");
      return;
    }

    if (!window.confirm("¿Estás seguro de que querés eliminar este edificio?")) return;

    const res = await remove(`/buildings/delete/${id}`);
    if (res) {
      await fetchBuildings();
    }
  };

  // 🛑 Esperar a que user esté cargado antes de renderizar
  if (!user) return <p className="text-center py-10 text-gray-500">Cargando usuario...</p>;

  if (loading)
    return <p className="text-center py-10 text-gray-500">Cargando edificios...</p>;
  if (error)
    return (
      <p className="text-center py-10 text-red-600 font-semibold">
        Error: {error}
      </p>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Edificios</h1>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">

        {/* Botón agregar edificio */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => {
              if (trialExpired) {
                alert("Tu prueba gratuita ha finalizado. Por favor, activa un plan para continuar.");
                return;
              }
              setShowForm(!showForm);
              setEditingBuilding(null);
              setName("");
              setAddress("");
            }}
            className={`px-5 py-2 rounded-md text-white font-semibold transition-shadow ${
              trialExpired
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-ediblue hover:bg-ediblueLight shadow-md hover:shadow-lg"
            }`}
            disabled={trialExpired}
          >
            {showForm ? "Cancelar" : "Agregar edificio"}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <form
            onSubmit={handleAddOrUpdateBuilding}
            className="mb-8 max-w-md mx-auto p-6 bg-gray-50 rounded-lg shadow-inner"
          >
            <label className="block mb-2 font-semibold text-gray-700">Nombre del edificio</label>
            <input
              type="text"
              placeholder="Nombre del edificio"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ediblue"
              required
              disabled={trialExpired}
            />

            <label className="block mt-4 mb-2 font-semibold text-gray-700">Dirección</label>
            <input
              type="text"
              placeholder="Dirección"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ediblue"
              required
              disabled={trialExpired}
            />

            <div className="flex items-center gap-4 mt-6">
              <button
                type="submit"
                disabled={loadingPost || loadingPut || trialExpired}
                className={`px-5 py-2 rounded-md text-white font-semibold transition ${
                  trialExpired
                    ? "bg-gray-400 cursor-not-allowed"
                    : loadingPost || loadingPut
                    ? "bg-ediblueLight cursor-wait"
                    : "bg-green-500 hover:bg-green-600"
                }`}
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
                  className="text-gray-600 hover:underline focus:outline-none"
                >
                  Cancelar edición
                </button>
              )}
            </div>
            {(errorPost || errorPut) && (
              <p className="text-red-600 text-sm mt-3 text-center font-semibold">
                {errorPost || errorPut}
              </p>
            )}
          </form>
        )}

        {/* Tabla responsive */}
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {editingBuilding ? "Editando Edificio" : "Lista de Edificios"}
          </h2>
          <table className="min-w-full bg-white border border-gray-200 rounded-md">
            <thead className="bg-ediblue text-white">
              <tr>
                <th className="py-3 px-4 text-left font-semibold border-b border-ediblueLight">ID</th>
                <th className="py-3 px-4 text-left font-semibold border-b border-ediblueLight">Nombre</th>
                <th className="py-3 px-4 text-left font-semibold border-b border-ediblueLight">Ubicación</th>
                <th className="py-3 px-4 text-left font-semibold border-b border-ediblueLight">Residentes</th>
                <th className="py-3 px-4 text-left font-semibold border-b border-ediblueLight">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {buildings.map((building) => (
                <tr
                  key={building.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="py-3 px-4 border-b border-gray-200">{building.id}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{building.name}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{building.address}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{building.residentCount}</td>
                  <td className="py-3 px-4 border-b border-gray-200 flex gap-3">
                    <button
                      onClick={() => {
                        if (trialExpired) {
                          alert("Tu prueba gratuita ha finalizado. Por favor, activa un plan para continuar.");
                          return;
                        }
                        setEditingBuilding(building);
                        setName(building.name);
                        setAddress(building.address);
                        setShowForm(true);
                      }}
                      className={`text-blue-600 hover:underline focus:outline-none ${
                        trialExpired ? "text-gray-400 cursor-not-allowed" : ""
                      }`}
                      disabled={trialExpired}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteBuilding(building.id)}
                      disabled={loadingDelete || trialExpired}
                      className={`text-red-600 hover:underline focus:outline-none ${
                        trialExpired ? "text-gray-400 cursor-not-allowed" : ""
                      }`}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {errorDelete && (
            <p className="text-red-600 text-sm mt-3 text-center font-semibold">
              {errorDelete}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Buildings;
