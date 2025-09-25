import React from "react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Electronics", icon: "📱" },
  { name: "Fashion", icon: "👕" },
  { name: "Home & Office", icon: "🏠" },
  { name: "Health & Beauty", icon: "💅" },
  { name: "Groceries", icon: "🛒" },
  { name: "Computing", icon: "💻" },
  { name: "Sporting Goods", icon: "⚽" },
  { name: "Gaming", icon: "🎮" },
  { name: "Baby Products", icon: "👶" },
  { name: "Automobile", icon: "🚗" },
];

const CategoryMenu = () => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.name}>
            <Link
              to={`/category/${category.name.toLowerCase()}`}
              className="flex items-center space-x-2 text-gray-600 hover:text-orange"
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryMenu;
