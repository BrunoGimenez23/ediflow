import { useState, useEffect } from "react";
import { useApartmentContext } from "../../contexts/ApartmentContext";
import { useBuildingsContext } from "../../contexts/BuildingContext";
import usePost from "../../hooks/usePost";
import usePut from "../../hooks/usePut";
import useDelete from "../../hooks/useDelete";
import { useAuth } from "../../contexts/AuthContext";

const Apartments = () => {
  const { apartments, setApartments, loading, error, fetchApartments } = useApartmentContext();
  const { buildings, loading: loadingBuildings } = useBuildingsContext();
  const { post, loading: loadingPost, error: errorPost } = usePost();
  const { put, loading: loadingPut, error: errorPut } = usePut();
  const { remove, loading: loadingDelete, error: errorDelete } = useDelete();
  const { user } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [number, setNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [editingApartment, setEditingApartment] = useState(null);

  const [resFormVisibleId, setResFormVisibleId] = useState(null);
  const [resFullName, setResFullName] = useState("");
  const [resEmail, setResEmail] = useState("");
  const [resUsername, setResUsername] = useState("");
  const [resPassword, setResPassword] = useState("");
  const [resCI, setResCI] = useState("");

  useEffect(() => {
    if (resFormVisibleId !== null) {
      setResFullName("");
      setResEmail("");
      setResUsername("");
      setResPassword("");
      setResCI("");
    }
  }, [resFormVisibleId]);

  const handleAddOrUpdateApartment = async (e) => {
    e.preventDefault();
    if (!user?.adminId) return;

    const payload = {
      number: parseInt(number, 10),
      floor: parseInt(floor, 10),
      buildingId: parseInt(buildingId, 10),
      adminId: user.adminId,
    };

    const res = editingApartment
      ? await put(`/apartment/update/${editingApartment.id}`, payload)
      : await post("/apartment/create", payload);

    if (res) {
      await fetchApartments();
      setNumber("");
      setFloor("");
      setBuildingId("");
      setShowForm(false);
      setEditingApartment(null);
    }
  };

  const handleDeleteApartment = async (id) => {
    if (window.confirm("¿Eliminar este apartamento?")) {
      const res = await remove(`/apartment/delete/${id}`);
      if (res) await fetchApartments();
    }
  };

  const handleAssignResident = async (e, apartmentId) => {
    e.preventDefault();

    if (!resFullName || !resEmail || !resUsername || !resPassword || !resCI) {
      alert("Completa todos los campos del residente.");
      return;
    }

    const payload = {
      username: resUsername,
      email: resEmail,
      password: resPassword,
      fullName: resFullName,
      ci: Number(resCI),
      apartmentId: apartmentId,
    };
    
    console.log("Payload que se envía:", payload);
    const userCreated = await post("/auth/register-resident", payload);
    console.log("userCreated:", userCreated);

    // Si no es null y tiene un ID, lo consideramos válido
    if (userCreated && userCreated.id) {
      const updatedApartments = apartments.map((apt) =>
        apt.id === apartmentId
          ? {
              ...apt,
              residentDTO: {
                userDTO: userCreated,
              },
            }
          : apt
      );

      setApartments(updatedApartments);

      setResFormVisibleId(null);
      setResFullName("");
      setResEmail("");
      setResUsername("");
      setResPassword("");
      setResCI("");
    } else {
      alert("Error al crear residente");
    }
  };

  const handleCancelAssignResident = () => {
    setResFormVisibleId(null);
    setResFullName("");
    setResEmail("");
    setResUsername("");
    setResPassword("");
    setResCI("");
  };

  if (loading || loadingBuildings) return <p className="text-center">Cargando apartamentos y edificios...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Apartamentos</h1>

      {/* Formulario nuevo apartamento */}
      <div className="mb-6 text-right">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingApartment(null);
            setNumber("");
            setFloor("");
            setBuildingId("");
          }}
          className="bg-ediblue text-white px-4 py-2 rounded hover:bg-ediblueLight transition"
        >
          {showForm ? "Cancelar" : "Agregar apartamento"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddOrUpdateApartment} className="mb-6 space-y-4">
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Número"
            required
          />
          <input
            type="number"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Piso"
            required
          />
          <select
            value={buildingId}
            onChange={(e) => setBuildingId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
            disabled={!!editingApartment}
          >
            <option value="">Selecciona un edificio</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            disabled={loadingPost || loadingPut}
          >
            {editingApartment ? "Actualizar" : "Guardar"}
          </button>
        </form>
      )}

      {/* Tabla */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Número</th>
            <th className="py-2 px-4 border-b">Piso</th>
            <th className="py-2 px-4 border-b">Residente</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Edificio</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {apartments.map((apt) => (
            <tr key={apt.id}>
              <td className="py-2 px-4 border-b">{apt.number}</td>
              <td className="py-2 px-4 border-b">{apt.floor}</td>
              <td className="py-2 px-4 border-b">{apt.residentDTO?.userDTO?.fullName || "Sin asignar"}</td>
              <td className="py-2 px-4 border-b">{apt.residentDTO?.userDTO?.email || "-"}</td>
              <td className="py-2 px-4 border-b">{apt.buildingDTO?.name || "-"}</td>
              <td className="py-2 px-4 border-b flex flex-col space-y-1">
                <button
                  onClick={() => {
                    setEditingApartment(apt);
                    setNumber(apt.number);
                    setFloor(apt.floor);
                    setBuildingId(apt.buildingDTO?.id || "");
                    setShowForm(true);
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteApartment(apt.id)}
                  disabled={loadingDelete || !!apt.residentDTO}
                  className={`hover:underline ${apt.residentDTO ? "text-gray-400 cursor-not-allowed" : "text-red-500"}`}
                  title={apt.residentDTO ? "No se puede eliminar porque tiene residente asignado" : "Eliminar apartamento"}
                >
                  Eliminar
                </button>
                {!apt.residentDTO ? (
                  <button
                    onClick={() => setResFormVisibleId(apt.id)}
                    className="text-green-500 hover:underline"
                  >
                    Asignar residente
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (window.confirm("Esto reemplazará al residente actual. ¿Continuar?")) {
                        setResFormVisibleId(apt.id);
                      }
                    }}
                    className="text-yellow-600 hover:underline"
                  >
                    Reasignar residente
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulario de asignación */}
      {resFormVisibleId !== null && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Asignar residente</h3>
          <form onSubmit={(e) => handleAssignResident(e, resFormVisibleId)} className="space-y-3">
            <input className="w-full border p-2 rounded" placeholder="Nombre completo" value={resFullName} onChange={(e) => setResFullName(e.target.value)} required />
            <input className="w-full border p-2 rounded" placeholder="Email" type="email" value={resEmail} onChange={(e) => setResEmail(e.target.value)} required />
            <input className="w-full border p-2 rounded" placeholder="Nombre de usuario" value={resUsername} onChange={(e) => setResUsername(e.target.value)} required />
            <input className="w-full border p-2 rounded" placeholder="Contraseña" type="password" value={resPassword} onChange={(e) => setResPassword(e.target.value)} required />
            <input className="w-full border p-2 rounded" placeholder="CI" value={resCI} onChange={(e) => setResCI(e.target.value)} required />

            <div className="flex gap-4">
              <button type="submit" className="bg-ediblue text-white px-4 py-2 rounded" disabled={loadingPost}>Asignar</button>
              <button type="button" onClick={handleCancelAssignResident} className="text-gray-500 hover:underline">Cancelar</button>
            </div>

            {(errorPost || errorPut || errorDelete) && (
              <p className="text-red-500 text-sm">
                {errorPost || errorPut || errorDelete}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Apartments;
