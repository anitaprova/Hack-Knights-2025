import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Records from "./pages/Records";
import Account from "./pages/Account";
import Dictionary from "./pages/Dictionary";
import Results from "./pages/Results";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Records" element={<Records />} />
        <Route path="/Account" element={<Account />} />
        <Route path="/Dictionary" element={<Dictionary />} />
        <Route path="/Results" element={<Results />} />
      </Routes>
    </>
  );
}

export default App;
