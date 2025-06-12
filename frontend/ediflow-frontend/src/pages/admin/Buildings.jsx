import { useBuildingsContext } from "../../contexts/BuildingContext";

const Buildings = () => {
  const { buildings, loading, error } = useBuildingsContext();

  if (loading) return <p className="text-center">Cargando edificios...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!buildings) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Edificios</h1>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-700">Aquí puedes gestionar los edificios de tu comunidad.</p>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Lista de Edificios</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Nombre</th>
                <th className="py-2 px-4 border-b">Ubicación</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {buildings.map((building) => (
                <tr key={building.id}>
                  <td className="py-2 px-4 border-b">{building.id}</td>
                  <td className="py-2 px-4 border-b">{building.name}</td>
                  <td className="py-2 px-4 border-b">{building.address}</td>
                  <td className="py-2 px-4 border-b">
                    <button className="text-blue-500 hover:underline">Editar</button>
                    <button className="text-red-500 hover:underline ml-4">Eliminar</button>
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
