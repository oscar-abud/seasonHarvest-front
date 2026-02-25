import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Test from "./pages/test.jsx";

function App() {
  return (
    <Router>
      <Toaster richColors position="bottom-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={ <Home /> } />
        <Route path="/app/test" element={ <Test /> } />
        <Route path="*" element={ <Home /> } />
      </Routes>
    </Router>
  );
}

export default App;