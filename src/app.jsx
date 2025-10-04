import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Campanhas from "./pages/Campanhas";
import Admin from "./pages/Admin";

function App() {
  const [showAdminBtn, setShowAdminBtn] = useState(false);

  useEffect(() => {
    const listener = (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === "KeyA") {
        setShowAdminBtn(true);
        alert("🔓 Botão de admin ativado temporariamente!");
        setTimeout(() => setShowAdminBtn(false), 10000);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="p-4 bg-white shadow flex justify-between items-center">
          <h1 className="font-bold text-xl text-gray-800">🎬 ClipHub</h1>
          <nav className="space-x-4">
            <Link to="/" className="text-blue-600 hover:underline">
              Campanhas
            </Link>
            {showAdminBtn && (
              <Link
                to="/admin"
                className="text-red-600 hover:underline font-semibold"
              >
                Painel Admin
              </Link>
            )}
          </nav>
        </header>

        <main className="p-6">
          <Routes>
            <Route path="/" element={<Campanhas />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
