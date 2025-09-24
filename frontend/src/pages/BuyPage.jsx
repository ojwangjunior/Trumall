import React, { useState } from "react";

import BuyPageHeader from "../components/buy/BuyPageHeader";
import BuyPageSearchAndFilter from "../components/buy/BuyPageSearchAndFilter";
import BuyPageProductGrid from "../components/buy/BuyPageProductGrid";
import BuyPageCartDisplay from "../components/buy/BuyPageCartDisplay";

const BuyPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);

  const handleSearch = () => {
    // Handle search logic here
    console.log("Searching for:", searchKeyword);
    // Mock search results (ideally from backend)
    setSearchResults([
      {
        id: 1,
        name: "Laptop",
        price: 1200,
        description: "A powerful laptop",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 2,
        name: "Keyboard",
        price: 75,
        description: "A mechanical keyboard",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 3,
        name: "Mouse",
        price: 25,
        description: "Wireless mouse",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 4,
        name: "Monitor",
        price: 300,
        description: "27-inch 4K monitor",
        image: "https://via.placeholder.com/150",
      },
    ]);
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <BuyPageHeader />

      <BuyPageSearchAndFilter
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        handleSearch={handleSearch}
      />

      <BuyPageProductGrid searchResults={searchResults} addToCart={addToCart} />

      <BuyPageCartDisplay cart={cart} />
    </div>
  );
};

export default BuyPage;
