export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ["workflow", "index"],
  [ROLES.USER]: ["index"],
} as const;

export const PROTECTED_ROUTE_TEXTS = {
  title: "Accès restreint",
  description:
    "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
  backButton: "Retour",
  contactAdmin:
    "Veuillez contacter votre administrateur si vous pensez qu'il s'agit d'une erreur.",
};
