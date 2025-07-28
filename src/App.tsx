import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Records from "./components/Records";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar and Topbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-100 p-4 pt-16 md:pt-4 md:ml-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/records" element={<Records />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App;