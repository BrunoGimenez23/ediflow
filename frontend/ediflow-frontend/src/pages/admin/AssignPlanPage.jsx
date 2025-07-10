import React from "react";
import AssignPlanForm from "../../components/admin/AssignPlanForm";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AssignPlanPage = () => {
  const { user } = useAuth();

  if (user?.email !== "bruno@ediflow.com") return <Navigate to="/" />;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Asignar plan manual</h1>
      <AssignPlanForm />
    </div>
  );
};

export default AssignPlanPage;
