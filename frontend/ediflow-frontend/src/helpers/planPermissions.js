export const planFeatures = {
  ESENCIAL: {
    canSeePayments: false,
    canManageResidents: true,
    canViewBuildings: true,
    canViewCommonAreas: false,
  },
  PROFESIONAL: {
    canSeePayments: true,
    canManageResidents: true,
    canViewBuildings: true,
    canViewCommonAreas: true,
  },
  PREMIUM_PLUS: {
    canSeePayments: true,
    canManageResidents: true,
    canViewBuildings: true,
    canViewCommonAreas: true,
  },
};

export function can(userPlan, feature) {
  if (!userPlan) return false;
  const plan = planFeatures[userPlan.toUpperCase()];
  return plan ? plan[feature] === true : false;
}
