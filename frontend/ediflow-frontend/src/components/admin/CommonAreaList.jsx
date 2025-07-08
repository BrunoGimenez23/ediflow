import React from "react";
import useFetch from "../hooks/useFetch";
import useDelete from "../hooks/useDelete";
import { Link, useNavigate } from "react-router-dom";
import { useBuildingsContext } from "../../contexts/BuildingContext";

const CommonAreaList = () => {
  const { data: areas, loading, error } = useFetch("/common-areas/all");
  const { remove, loading: deleting, error: deleteError } = useDelete();
  const { buildings, loading: loadingBuildings } = useBuildingsContext();
  const navigate = useNavigate();
  console.log("Render CommonAreaList");

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de eliminar esta área común?");
    if (!confirmed) return;

    const success = await remove(`/common-areas/${id}`);
    if (success) {
      alert("Área común eliminada");
      window.location.reload(); // o usar refetch si tenés
    }
  };

  if (loading || loadingBuildings) return <p>Cargando áreas comunes y edificios...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!areas?.length) return <p>No hay áreas comunes registradas.</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Áreas Comunes</h2>
      {deleteError && <p className="text-red-500">Error: {deleteError}</p>}
      <ul className="space-y-4">
        {areas.map((area) => {
           console.log("area.buildingId:", area.buildingId);
            console.log("buildings:", buildings);
          // Buscamos el edificio correspondiente al buildingId de la área
          const building = buildings.find((b) => b.id === area.buildingId);

          return (
            <li key={area.id} className="bg-white shadow rounded p-4">
              <p className="font-semibold text-lg">{area.name}</p>
              <p className="text-gray-700">{area.description}</p>
              <p className="text-sm text-gray-500">
                Capacidad: {area.capacity ?? "No especificada"}
              </p>
              <p className="text-sm text-gray-600 italic">
                Edificio: {building ? building.name : "No asignado"}
              </p>

              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => navigate(`/admin/common-areas/edit/${area.id}`)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(area.id)}
                  disabled={deleting}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  {deleting ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CommonAreaList;
