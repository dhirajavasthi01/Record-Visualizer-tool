import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, Table } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = (
    <nav className="space-y-2 px-4 py-2">
      <Link
        to="/"
        className={`flex items-center gap-2 px-3 py-2 rounded-md ${
          location.pathname === "/" ? "bg-gray-800 text-white" : "text-gray-800 text-white"
        }`}
      >
        <LayoutDashboard className="w-4 h-4" />
        Dashboard
      </Link>
      <Link
        to="/records"
        className={`flex items-center gap-2 px-3 py-2 rounded-md ${
          location.pathname === "/records" ? "bg-gray-800 text-white" : "text-gray-800 text-white"
        }`}
      >
        <Table className="w-4 h-4" />
        Records
      </Link>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-4">
        <h1 className="text-2xl font-semibold mb-5">Record Visualizer</h1>
        {navLinks}
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
        <div className="text-xl font-semibold">Record Visualizer</div>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Nav */}
      {isOpen && (
        <div className="md:hidden fixed top-14 left-0 w-full bg-white shadow-md z-40">
          {navLinks}
        </div>
      )}
    </>
  );
};

export default Navbar;
