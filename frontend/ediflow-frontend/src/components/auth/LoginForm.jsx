import { useState } from "react";
import usePost from "../../hooks/usePost";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LoginForm = () => {
  const { post, loading: loadingPost, error: errorPost } = usePost();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await post("/auth/login", { email, password });

    if (res?.token) {
      localStorage.setItem("token", res.token);

      // Opcional: actualizar user en contexto si usás context
      await fetchUser();

      // Uso directo del rol recibido en login para redirigir
      const role = res.user?.role;

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "RESIDENT") {
        navigate("/resident");
      } else {
        alert("Rol desconocido");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-ediblue">
        Iniciar sesión
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Correo electrónico"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ediblue"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Contraseña"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ediblue"
          required
        />
        <button
          type="submit"
          disabled={loadingPost}
          className="w-full bg-ediblue text-white py-2 rounded-md hover:bg-ediblueLight transition duration-200"
        >
          {loadingPost ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>

      {errorPost && (
        <p className="mt-4 text-red-600 text-sm text-center">{errorPost}</p>
      )}
    </div>
  );
};

export default LoginForm;
