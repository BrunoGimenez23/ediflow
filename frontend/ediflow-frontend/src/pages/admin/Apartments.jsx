import React, { useState, useEffect, Fragment, useRef } from "react";
import { useApartmentContext } from "../../contexts/ApartmentContext";
import { useBuildingsContext } from "../../contexts/BuildingContext";
import usePost from "../../hooks/usePost";
import usePut from "../../hooks/usePut";
import useDelete from "../../hooks/useDelete";
import { useAuth } from "../../contexts/AuthContext";
import { canEdit, canDelete, canAssignResident, isTrialBlocked } from "../../utils/roles";

const Apartments = () => {
  const { trialExpired, user } = useAuth();
  const {
    apartments,
    setApartments,
    loading,
    error,
    fetchApartments,
    page,
    setPage,
    totalPages,
    filter,
    setFilter,
    buildingIdFilter,
    setBuildingIdFilter,
    assignResident,
    fetchUserByEmail,
  } = useApartmentContext();
  const { buildings, loading: loadingBuildings } = useBuildingsContext();
  const { post, loading: loadingPost, error: errorPost } = usePost();
  const { put, loading: loadingPut, error: errorPut } = usePut();
  const { remove, loading: loadingDelete, error: errorDelete } = useDelete();

  const [number, setNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [editingApartment, setEditingApartment] = useState(null);
  const [creatingApartment, setCreatingApartment] = useState(false);

  const [resFormVisibleId, setResFormVisibleId] = useState(null);
  const [resFullName, setResFullName] = useState("");
  const [resEmail, setResEmail] = useState("");
  const [resUsername, setResUsername] = useState("");
  const [resPassword, setResPassword] = useState("");
  const [resCI, setResCI] = useState("");
  const [assignError, setAssignError] = useState("");
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  useEffect(() => {
    if (resFormVisibleId !== null) {
      setResFullName("");
      setResEmail("");
      setResUsername("");
      setResPassword("");
      setResCI("");
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [resFormVisibleId]);

  useEffect(() => {
    if (editingApartment) {
      setNumber(editingApartment.number);
      setFloor(editingApartment.floor);
      setBuildingId(editingApartment.buildingDTO?.id || "");
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } else if (!creatingApartment) {
      setNumber("");
      setFloor("");
      setBuildingId("");
    }
  }, [editingApartment, creatingApartment]);

  const handleBuildingFilterChange = (e) => {
    setBuildingIdFilter(e.target.value);
    setPage(0);
  };

  // Función agregada para actualizar apartamento
  const handleAddOrUpdateApartment = async (e) => {
    e.preventDefault();

    if (isTrialBlocked(user, trialExpired)) {
      alert("Tu prueba gratuita ha finalizado. Por favor, activa un plan para continuar.");
      return;
    }
    if (!canEdit(user)) return;

    const payload = {
      number: parseInt(number, 10),
      floor: parseInt(floor, 10),
      buildingId: buildingId ? parseInt(buildingId, 10) : null,
    };

    try {
      const response = await put(`/apartment/update/${editingApartment.id}`, payload);
      if (response) {
        alert("Apartamento actualizado correctamente.");
        setEditingApartment(null);
        await fetchApartments(page, filter);
      } else {
        alert("No se pudo actualizar el apartamento.");
      }
    } catch (err) {
      alert("Error al actualizar el apartamento: " + err.message);
    }
  };

  const handleCreateApartment = async (e) => {
    e.preventDefault();
    
    if (isTrialBlocked(user, trialExpired)) {
      alert("Tu prueba gratuita ha finalizado. Por favor, activa un plan para continuar.");
      return;
    }
    if (!canEdit(user)) return;

    const payload = {
      number: parseInt(number, 10),
      floor: parseInt(floor, 10),
      buildingId: buildingId,
    };

    try {
      await post("/apartment/create", payload);
      console.log("Apartamento creado:");
      setCreatingApartment(false);
      fetchApartments(page, filter);
      setNumber("");
      setFloor("");
      setBuildingId("");
    } catch (error) {
      alert("Error al crear apartamento: " + error.message);
    }
  };

  const handleDeleteApartment = async (id) => {
    if (!window.confirm("¿Estás seguro que quieres eliminar este apartamento?")) return;
    try {
      await remove(`/apartment/delete/${id}`);
      alert("Apartamento eliminado correctamente.");
      fetchApartments(page, filter);
    } catch (error) {
      alert("Error al eliminar apartamento: " + error.message);
    }
  };

  const handleAssignResident = async (e, apartmentId) => {
  e.preventDefault();

  if (isTrialBlocked(user, trialExpired)) {
    alert("Tu prueba gratuita ha finalizado. Por favor, activa un plan para continuar.");
    return;
  }

  if (!canAssignResident(user)) return;

  if (!resFullName || !resEmail || !resUsername || !resPassword || !resCI) {
    alert("Completa todos los campos del residente.");
    return;
  }

  const payload = {
    apartmentId,
    username: resUsername,
    email: resEmail,
    password: resPassword,
    fullName: resFullName,
    ci: parseInt(resCI, 10),
  };

  setAssignError("");
  setErrors({});

  const response = await post("/residents/register-or-replace", payload);

  if (response.error) {
    const msg = response.error;

    
    if (msg.toLowerCase().includes("contraseña")) {
      setErrors((prev) => ({ ...prev, resPassword: msg }));
    } else if (msg.toLowerCase().includes("email")) {
      setErrors((prev) => ({ ...prev, resEmail: msg }));
    } else if (msg.toLowerCase().includes("nombre")) {
      setErrors((prev) => ({ ...prev, resFullName: msg }));
    } else if (msg.toLowerCase().includes("usuario")) {
      setErrors((prev) => ({ ...prev, resUsername: msg }));
    } else if (msg.toLowerCase().includes("ci")) {
      setErrors((prev) => ({ ...prev, resCI: msg }));
    } else {
      setAssignError(msg);
    }
  } else if (response.data) {
    await fetchApartments(page, filter);
    setResFormVisibleId(null);
  } else {
    setAssignError("No se pudo completar la asignación del residente.");
  }


};


  const handleCancelAssignResident = () => {
    setResFormVisibleId(null);
  };

  // Paginación
  const goToPrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const goToNextPage = () => {
    if (page + 1 < totalPages) setPage(page + 1);
  };

  if (loading || loadingBuildings)
    return (
      <p className="text-center py-10 text-gray-500">
        Cargando apartamentos y edificios...
      </p>
    );

  if (error)
    return (
      <p className="text-center py-10 text-red-600 font-semibold">Error: {error}</p>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Apartamentos</h1>

      {/* FILTRO POR EDIFICIOS Y BOTÓN CREAR */}
      <div className="mb-4 max-w-md mx-auto flex justify-between items-center gap-4">
        <select
          value={buildingIdFilter}
          onChange={handleBuildingFilterChange}
          className="..."
          disabled={isTrialBlocked(user, trialExpired)}
        >
          <option value="">Todos los edificios</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            if (isTrialBlocked(user, trialExpired)) {
              alert("Tu prueba gratuita ha finalizado. Por favor, activa un plan para continuar.");
              return;
            }
            if (!canEdit(user)) return;
            setCreatingApartment(true);
            setEditingApartment(null);
          }}
          className={`px-4 py-2 rounded-md text-white font-semibold ${
            isTrialBlocked(user, trialExpired) || !canEdit(user)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-ediblue hover:bg-ediblueLight"
          } transition`}
          disabled={isTrialBlocked(user, trialExpired) || !canEdit(user)}
        >
          Crear apartamento
        </button>
      </div>

      {/* FORMULARIO CREAR APARTAMENTO */}
      {creatingApartment && (
        <div
          ref={formRef}
          className="mb-6 max-w-md mx-auto p-6 bg-gray-50 rounded-md shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">Crear apartamento</h2>
          <form onSubmit={handleCreateApartment} className="space-y-4">
            <label className="block mb-1 font-medium text-gray-700">Número</label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              disabled={isTrialBlocked(user, trialExpired) || !canEdit(user)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ediblue"
            />

            <label className="block mb-1 font-medium text-gray-700">Piso</label>
            <input
              type="number"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              required
              disabled={isTrialBlocked(user, trialExpired) || !canEdit(user)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ediblue"
            />

            <label className="block mb-1 font-medium text-gray-700">Edificio</label>
            <select
              value={buildingId}
              onChange={(e) => setBuildingId(e.target.value)}
              required
              disabled={isTrialBlocked(user, trialExpired) || !canEdit(user)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ediblue"
            >
              <option value="">Selecciona un edificio</option>
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <div className="flex justify-between items-center mt-4">
              <button
                type="submit"
                className={`px-5 py-2 rounded-md text-white font-semibold ${
                  isTrialBlocked(user, trialExpired) || !canEdit(user)
                    ? "bg-gray-400 cursor-not-allowed"
                    : loadingPost
                    ? "bg-ediblueLight cursor-wait"
                    : "bg-ediblue hover:bg-ediblueLight"
                } transition`}
                disabled={loadingPost || isTrialBlocked(user, trialExpired) || !canEdit(user)}
              >
                Crear
              </button>
              <button
                type="button"
                className="text-gray-600 hover:underline focus:outline-none"
                onClick={() => setCreatingApartment(false)}
                disabled={isTrialBlocked(user, trialExpired)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md">
          <thead className="bg-ediblue text-white">
            <tr>
              {["Número", "Piso", "Residente", "Email", "Edificio", "Acciones"].map(
                (title) => (
                  <th
                    key={title}
                    className="py-3 px-4 text-left font-semibold border-b border-ediblueLight"
                  >
                    {title}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {apartments.map((apt) =>  {
              return (
              <Fragment key={apt.id}>
                
                <tr className="hover:bg-gray-100 transition-colors">
                  <td className="py-3 px-4 border-b border-gray-200">{apt.number}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{apt.floor}</td>
                  <td className="py-3 px-4 border-b border-gray-200">
                    {apt.residentDTO?.userDTO?.fullName || "Sin asignar"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200">
                    {apt.residentDTO?.userDTO?.email || "-"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200">
                    {apt.buildingDTO?.name || "-"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        if (isTrialBlocked(user, trialExpired)) {
                          alert(
                            "Tu prueba gratuita ha finalizado. Por favor, activa un plan para continuar."
                          );
                          return;
                        }
                        if (!canEdit(user)) return;
                        setEditingApartment(apt);
                        setCreatingApartment(false);
                      }}
                      className={`text-white bg-ediblue hover:bg-ediblueLight rounded px-3 py-1 text-sm font-medium ${
                        isTrialBlocked(user, trialExpired) || !canEdit(user)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={isTrialBlocked(user, trialExpired) || !canEdit(user)}
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDeleteApartment(apt.id)}
                      disabled={
                        loadingDelete ||
                        apt.residentDTO !== null ||
                        isTrialBlocked(user, trialExpired) ||
                        !canDelete(user)
                      }
                      className={`text-white bg-red-600 hover:bg-red-700 rounded px-3 py-1 text-sm font-medium ${
                        apt.residentDTO !== null || !canDelete(user)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      title={
                        !canDelete(user)
                          ? "No tenés permiso para eliminar"
                          : apt.residentDTO !== null
                          ? "No se puede eliminar porque tiene residente asignado"
                          : "Eliminar apartamento"
                      }
                    >
                      Eliminar
                    </button>

                    {!apt.residentDTO ? (
                      
                      <button
                        onClick={() => {
                          if (isTrialBlocked(user, trialExpired)) {
                            alert(
                              "Tu prueba gratuita ha finalizado. Por favor, activa un plan para continuar."
                            );
                            return;
                          }
                          if (!canAssignResident(user)) return;
                          setResFormVisibleId(apt.id);
                        }}
                        className={`text-white bg-green-600 hover:bg-green-700 rounded px-3 py-1 text-sm font-medium ${
                          isTrialBlocked(user, trialExpired) || !canAssignResident(user)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={isTrialBlocked(user, trialExpired) || !canAssignResident(user)}
                      >
                        Asignar residente
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (isTrialBlocked(user, trialExpired)) {
                            alert(
                              "Tu prueba gratuita ha finalizado. Por favor, activa un plan para continuar."
                            );
                            return;
                          }
                          if (!canAssignResident(user)) return;
                          if (window.confirm("Esto reemplazará al residente actual. ¿Continuar?")) {
                            setResFormVisibleId(apt.id);
                          }
                        }}
                        className={`text-white bg-yellow-600 hover:bg-yellow-700 rounded px-3 py-1 text-sm font-medium ${
                          isTrialBlocked(user, trialExpired) || !canAssignResident(user)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={isTrialBlocked(user, trialExpired) || !canAssignResident(user)}
                      >
                        Reasignar residente
                      </button>
                    )}
                  </td>
                </tr>

                {/* FORM EDITAR APARTAMENTO justo debajo de la fila */}
                {editingApartment?.id === apt.id && (
                  <tr>
                    <td colSpan={6} ref={formRef} className="bg-gray-50 p-6">
                      <form
                        onSubmit={handleAddOrUpdateApartment}
                        className="space-y-4 max-w-md mx-auto"
                      >
                        <label className="block mb-1 font-medium text-gray-700">
                          Número
                        </label>
                        <input
                          type="number"
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                          required
                          disabled={isTrialBlocked(user, trialExpired) || !canEdit(user)}
                          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ediblue"
                        />

                        <label className="block mb-1 font-medium text-gray-700">
                          Piso
                        </label>
                        <input
                          type="number"
                          value={floor}
                          onChange={(e) => setFloor(e.target.value)}
                          required
                          disabled={isTrialBlocked(user, trialExpired) || !canEdit(user)}
                          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ediblue"
                        />

                        <label className="block mb-1 font-medium text-gray-700">
                          Edificio
                        </label>
                        <select
                          value={buildingId}
                          onChange={(e) => setBuildingId(e.target.value)}
                          required
                          disabled={isTrialBlocked(user, trialExpired) || !canEdit(user)}
                          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ediblue"
                        >
                          <option value="">Selecciona un edificio</option>
                          {buildings.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>

                        <div className="flex justify-between items-center mt-4">
                          <button
                            type="submit"
                            className={`px-5 py-2 rounded-md text-white font-semibold ${
                              isTrialBlocked(user, trialExpired) || !canEdit(user)
                                ? "bg-gray-400 cursor-not-allowed"
                                : loadingPut
                                ? "bg-ediblueLight cursor-wait"
                                : "bg-ediblue hover:bg-ediblueLight"
                            } transition`}
                            disabled={loadingPut || isTrialBlocked(user, trialExpired) || !canEdit(user)}
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            className="text-gray-600 hover:underline focus:outline-none"
                            onClick={() => setEditingApartment(null)}
                            disabled={isTrialBlocked(user, trialExpired)}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                )}

                {/* FORMULARIO ASIGNAR/REASIGNAR RESIDENTE justo debajo */}
                {resFormVisibleId === apt.id && (
  <tr>
    <td colSpan={6} ref={formRef} className="bg-green-50 p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">
        {apt.residentDTO ? "Reasignar" : "Asignar"} residente
      </h3>
      <form
        onSubmit={(e) => handleAssignResident(e, apt.id)}
        className="space-y-4 max-w-md mx-auto"
        noValidate
      >
        <input
          type="text"
          placeholder="Nombre completo"
          value={resFullName}
          onChange={(e) => setResFullName(e.target.value)}
          disabled={isTrialBlocked(user, trialExpired) || !canAssignResident(user)}
          className={`w-full border p-2 rounded-md focus:outline-none focus:ring-2 ${
            errors.resFullName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
          }`}
        />
        {errors.resFullName && (
          <p className="text-red-500 text-sm mt-1">{errors.resFullName}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={resEmail}
          onChange={(e) => setResEmail(e.target.value)}
          disabled={isTrialBlocked(user, trialExpired) || !canAssignResident(user)}
          className={`w-full border p-2 rounded-md focus:outline-none focus:ring-2 ${
            errors.resEmail ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
          }`}
        />
        {errors.resEmail && (
          <p className="text-red-500 text-sm mt-1">{errors.resEmail}</p>
        )}

        <input
          type="text"
          placeholder="Nombre de usuario"
          value={resUsername}
          onChange={(e) => setResUsername(e.target.value)}
          disabled={isTrialBlocked(user, trialExpired) || !canAssignResident(user)}
          className={`w-full border p-2 rounded-md focus:outline-none focus:ring-2 ${
            errors.resUsername ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
          }`}
        />
        {errors.resUsername && (
          <p className="text-red-500 text-sm mt-1">{errors.resUsername}</p>
        )}

        <input
          type="password"
          placeholder="Contraseña"
          value={resPassword}
          onChange={(e) => setResPassword(e.target.value)}
          disabled={isTrialBlocked(user, trialExpired) || !canAssignResident(user)}
          className={`w-full border p-2 rounded-md focus:outline-none focus:ring-2 ${
            errors.resPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
          }`}
        />
        {errors.resPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.resPassword}</p>
        )}

        <input
          type="number"
          placeholder="CI"
          value={resCI}
          onChange={(e) => setResCI(e.target.value)}
          disabled={isTrialBlocked(user, trialExpired) || !canAssignResident(user)}
          className={`w-full border p-2 rounded-md focus:outline-none focus:ring-2 ${
            errors.resCI ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
          }`}
        />
        {errors.resCI && (
          <p className="text-red-500 text-sm mt-1">{errors.resCI}</p>
        )}

        {assignError && (
          <p className="text-red-600 font-semibold text-center mt-2">{assignError}</p>
        )}

        <div className="flex justify-between items-center mt-4">
          <button
            type="submit"
            className={`px-5 py-2 rounded-md text-white font-semibold ${
              isTrialBlocked(user, trialExpired) || !canAssignResident(user)
                ? "bg-gray-400 cursor-not-allowed"
                : loadingPost
                ? "bg-green-400 cursor-wait"
                : "bg-green-600 hover:bg-green-700"
            } transition`}
            disabled={loadingPost || isTrialBlocked(user, trialExpired) || !canAssignResident(user)}
          >
            Guardar
          </button>
          <button
            type="button"
            className="text-gray-600 hover:underline focus:outline-none"
            onClick={handleCancelAssignResident}
            disabled={isTrialBlocked(user, trialExpired)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </td>
  </tr>
)}

              </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-6 max-w-md mx-auto">
        <button
          onClick={goToPrevPage}
          disabled={page === 0}
          className="px-4 py-2 bg-ediblue text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span>
          Página {page + 1} de {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={page + 1 >= totalPages}
          className="px-4 py-2 bg-ediblue text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Apartments;