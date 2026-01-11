import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeft, PanelLeftClose, LogOut } from "lucide-react";
import { SIDEBAR_MENU } from "../constants/sidebarMenu";
import { useNavigate } from "react-router-dom";

export default function AppSidebar({ activeTab, setActiveTab }) {

  const navigate = useNavigate();
  
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.innerWidth < 768) return true;
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("is_auth");
    localStorage.removeItem("auth_data");

    // Optional: clear sidebar state too
    localStorage.removeItem("sidebar-collapsed");

    // Redirect to login/root
    navigate("/", { replace: true });
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="h-screen bg-white border-r border-slate-200 shadow-sm flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
            R
          </div>

          {!collapsed && (
            <span className="font-semibold text-slate-800 whitespace-nowrap">
              Ryuks Copilot
            </span>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-slate-100 text-slate-600"
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        {SIDEBAR_MENU.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`group w-full flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-100"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon
                size={20}
                className={`${
                  isActive ? "text-emerald-700" : "text-slate-500"
                }`}
              />

              {!collapsed && (
                <AnimatePresence>
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                </AnimatePresence>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium transition
            text-red-600 hover:bg-red-50
            ${collapsed ? "justify-center p-3" : "px-4 py-3"}
          `}
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </motion.aside>
  );
}
