import { useState } from "react";
import usePost from "../../hooks/usePost";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LoginForm = () => {
  const { post, loading: loadingPost, error: errorPost } = usePost();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [trialExpired, setTrialExpired] = useState(false);
  const navigate = useNavigate();
  const { fetchUser, setToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTrialExpired(false);

    const { data: res, error: err } = await post("/auth/login", { email, password });

    if (res?.token) {
      localStorage.setItem("token", res.token);
      console.log("Token guardado en localStorage:", localStorage.getItem("token")); // <-- log aquí
      setToken(res.token);

      await fetchUser();
      console.log("Login response data:", res);

      const role = res.user?.role;

      if (role === "ADMIN" || role === "EMPLOYEE" || role === "SUPPORT") {
        navigate("/admin");
      } else if (role === "RESIDENT") {
        navigate("/resident");
      } else {
        alert("Rol desconocido");
      }
    } else if (err && err.toLowerCase().includes("período de prueba")) {
      setTrialExpired(true);
    } else if (err) {
      alert(err);
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

      {trialExpired && (
        <p className="mt-4 text-red-600 text-sm text-center">
          Tu período de prueba ha expirado. Por favor, contacta al administrador para continuar usando Ediflow.
        </p>
      )}

      {!trialExpired && errorPost && (
        <p className="mt-4 text-red-600 text-sm text-center">{errorPost}</p>
      )}
    </div>
  );
};

export default LoginForm;
