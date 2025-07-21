import { Route, Routes } from "react-router-dom";

import { ROLES } from "./components/ProtectedRoute/roles.constants";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";

import WorkflowPage from "@/pages/workflow";
import IndexPage from "@/pages/index";
import SignUpPage from "@/pages/signup";
import LoginPage from "@/pages/login";

function App(): JSX.Element {
  return (
    <Routes>
      <Route element={<SignUpPage />} path="/signup" />
      <Route element={<LoginPage />} path="/login" />

      <Route
        element={
          <ProtectedRoute>
            <IndexPage />
          </ProtectedRoute>
        }
        path="/"
      />

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
