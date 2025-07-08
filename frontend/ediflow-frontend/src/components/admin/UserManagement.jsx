import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import usePost from "../../hooks/usePost";
import usePut from "../../hooks/usePut";
import useDelete from "../../hooks/useDelete";

const UserManagement = () => {
  const { data: users, loading, error, refetch } = useFetch("/users");
  const { post, loading: loadingPost } = usePost();
  const { put, loading: loadingPut } = usePut();
  const { remove, loading: loadingDelete } = useDelete();

  const [localUsers, setLocalUsers] = useState([]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    role: "SUPPORT",
  });

  const [formError, setFormError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (users) setLocalUsers(users);
  }, [users]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleShowCreateForm = () => {
    setForm({
      username: "",
      email: "",
      fullName: "",
      password: "",
      role: "SUPPORT",
    });
    setFormError(null);
    setEditingUserId(null);
    setShowCreateForm(true);
  };

  const handleEdit = (user) => {
    setForm({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      password: "",
      role: user.role,
    });
    setFormError(null);
    setEditingUserId(user.id);
    setShowCreateForm(false);
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setShowCreateForm(false);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (editingUserId && !payload.password) {
      delete payload.password;
    }

    let result;

    if (editingUserId) {
      result = await put(`/users/${editingUserId}`, payload);
    } else {
      result = await post("/users", payload);
    }

    if (result?.error) {
      setFormError(result.error);
      return;
    }

    alert(editingUserId ? "Usuario actualizado" : "Usuario creado");

    if (editingUserId) {
      setLocalUsers((prev) =>
        prev.map((u) => (u.id === editingUserId ? { ...u, ...payload } : u))
      );
      setEditingUserId(null);
      setShowCreateForm(false);
    } else {
      await refetch();
    }

    setForm({
      username: "",
      email: "",
      fullName: "",
      password: "",
      role: "SUPPORT",
    });
    setFormError(null);
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("¿Estás seguro que deseas eliminar este usuario?");
    if (!confirmDelete) return;

    const result = await remove(`/users/${userId}`);
    if (result !== null) {
      alert("Usuario eliminado correctamente.");
      setLocalUsers((prev) => prev.filter((u) => u.id !== userId));
      if (editingUserId === userId) handleCancel();
    } else {
      alert("Hubo un error al eliminar el usuario.");
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4 my-4 p-4 border rounded bg-gray-50">
      <input
        type="text"
        name="username"
        placeholder="Nombre de usuario"
        value={form.username}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="fullName"
        placeholder="Nombre completo"
        value={form.fullName}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        name="password"
        placeholder={editingUserId ? "Nueva contraseña (opcional)" : "Contraseña"}
        value={form.password}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required={!editingUserId}
      />
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="ADMIN">Administrador</option>
        <option value="EMPLOYEE">Empleado</option>
        <option value="SUPPORT">Soporte</option>
      </select>

      {formError && <div className="text-red-600 font-medium">{formError}</div>}

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={loadingPost || loadingPut}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {(loadingPost || loadingPut)
            ? editingUserId
              ? "Actualizando..."
              : "Creando..."
            : editingUserId
            ? "Actualizar usuario"
            : "Invitar usuario"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
      </div>
    </form>
  );

  return (
    <div className="max-w-xl mx-auto p-4">
      <button
        onClick={handleShowCreateForm}
        className="mb-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        Invitar usuario
      </button>

      {loading && <p>Cargando usuarios...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <ul className="divide-y border rounded">
        {localUsers
          .filter((user) => user.role !== "RESIDENT")
          .map((user) => (
            <li key={user.id} className="py-2 px-4 flex flex-col">
              <div className="flex justify-between items-center">
                <div>
                  <strong>{user.fullName}</strong> - {user.role}
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline">
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:underline"
                    disabled={loadingDelete}
                  >
                    {loadingDelete ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>

              {editingUserId === user.id && renderForm()}
            </li>
          ))}
      </ul>

      {!editingUserId && showCreateForm && renderForm()}
    </div>
  );
};

export default UserManagement;
