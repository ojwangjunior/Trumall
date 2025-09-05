import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Welcome to Trumall!</h2>
      <p>What would you like to do?</p>
      <div className="flex space-x-4 mt-4">
        <Link to="/buy">
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">
            Buy Items
          </button>
        </Link>
        <Link to="/sell">
          <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">
            Sell Items
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;