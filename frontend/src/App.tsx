import { Route, Routes } from "react-router-dom";

import WorkflowPage from "@/pages/workflow";
import IndexPage from "@/pages/index";
import SignUpPage from "@/pages/signup";
import LoginPage from "@/pages/login";

// TODO: i18n
// TODO: ajouter des index.tsx dans les dossiers pour les imports
// TODO: typer tous les retours de fonctions
// TODO: responsive design
function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<SignUpPage />} path="/signup" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<WorkflowPage />} path="/workflow" />
    </Routes>
  );
}

export default App;
