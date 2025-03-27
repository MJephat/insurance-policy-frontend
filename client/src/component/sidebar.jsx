import React from 'react';
import { Home, ShoppingCart, Settings, Palette, Star, AlertTriangle } from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Home", icon: <Home size={20} /> },
    // { name: "Orders", icon: <ShoppingCart size={20} /> },
    // { name: "Settings", icon: <Settings size={20} /> },
    // { name: "Theme", icon: <Palette size={20} /> },
    // { name: "Icons", icon: <Star size={20} /> },
    // { name: "Error", icon: <AlertTriangle size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-gray-100 p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item.name} className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded cursor-pointer">
            {item.icon} {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
