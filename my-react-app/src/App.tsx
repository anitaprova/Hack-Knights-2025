import { Routes, Route } from "react-router";
import { useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Records from "./pages/Records";
import Account from "./pages/Account";
import Dictionary from "./pages/Dictionary";
import Results from "./pages/Results";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";

function App() {
  const pathname = useLocation().pathname;
  return (
    <>
      {(pathname !== "/Login" && pathname !== "/Signup") && <Navbar />}
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/Records" element={
          <ProtectedRoute>
            <Records />
          </ProtectedRoute>
        } />
        <Route path="/Account" element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } />
        <Route path="/Dictionary" element={
          <ProtectedRoute>
            <Dictionary />
          </ProtectedRoute>
        } />
        <Route path="/Results" element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
