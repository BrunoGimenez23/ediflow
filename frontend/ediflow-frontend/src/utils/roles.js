export const canEdit = (user) =>
  user?.role === "ADMIN" || user?.role === "EMPLOYEE";

export const canDelete = (user) =>
  user?.role === "ADMIN" || user?.role === "EMPLOYEE";

export const canAssignResident = (user) =>
  user?.role === "ADMIN" || user?.role === "EMPLOYEE";

export const isTrialBlocked = (user, trialExpired) =>
  user?.role === "ADMIN" && trialExpired;
