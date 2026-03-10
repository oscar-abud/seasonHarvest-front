import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Test from "./pages/test.jsx";
import SeasonHarvest from "./pages/sh-admin/SeasonHarvest.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/UI/layout/Layout.jsx";
import Perfil from "./pages/sh-admin/Perfil.jsx";
import Productos from "./pages/sh-admin/client/Productos.jsx";
import ProductosExtras from "./pages/sh-admin/client/ProductosExtras.jsx";

function App() {
  return (
    <Router>
      <Toaster richColors position="bottom-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={ <Home /> } />
        <Route path="/app/season-harvest" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<SeasonHarvest />} />
        </Route>

        <Route path="/app/season-harvest/profile" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Perfil />} />
        </Route>

        <Route path="/app/season-harvest/cliente-productos" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Productos />} />
        </Route>

        <Route path="/app/season-harvest/productos-extras" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<ProductosExtras />} />
        </Route>

        <Route path="/app/test" element={ <Test /> } />
        <Route path="*" element={ <Home /> } />
      </Routes>
    </Router>
  );
}

export default App;