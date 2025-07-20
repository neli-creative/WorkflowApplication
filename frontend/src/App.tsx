import { Route, Routes } from "react-router-dom";

import { ROLES } from "./components/ProtectedRoute/roles.constants";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";

import WorkflowPage from "@/pages/workflow";
import IndexPage from "@/pages/index";
import SignUpPage from "@/pages/signup";
import LoginPage from "@/pages/login";

// TODO: i18n
// TODO: ajouter des index.tsx dans les dossiers pour les imports
// TODO: typer tous les retours de fonctions
// TODO: responsive design
function App(): JSX.Element {
  return (
    <Routes>
      {/* Routes publiques (authentification) */}
      <Route element={<SignUpPage />} path="/signup" />
      <Route element={<LoginPage />} path="/login" />

      {/* Routes protégées - accès pour tous les utilisateurs connectés */}
      <Route
        element={
          <ProtectedRoute>
            <IndexPage />
          </ProtectedRoute>
        }
        path="/"
      />

      {/* Route protégée - accès réservé aux administrateurs */}
      <Route
        element={
          <ProtectedRoute requiredRole={ROLES.ADMIN}>
            <WorkflowPage />
          </ProtectedRoute>
        }
        path="/workflow"
      />
    </Routes>
  );
}

export default App;
