import React, { useState, useEffect } from "react";
import axios from "axios";

import BuyPageHeader from "../components/buy/BuyPageHeader";
import BuyPageSearchAndFilter from "../components/buy/BuyPageSearchAndFilter";
import BuyPageProductGrid from "../components/buy/BuyPageProductGrid";
import BuyPageCartDisplay from "../components/buy/BuyPageCartDisplay";

const BuyPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = () => {
    const lowercasedKeyword = searchKeyword.toLowerCase();
    const results = products.filter(product =>
      product.title.toLowerCase().includes(lowercasedKeyword) ||
      product.description.toLowerCase().includes(lowercasedKeyword)
    );
    setFilteredProducts(results);
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

      <BuyPageProductGrid searchResults={filteredProducts} addToCart={addToCart} />

      <BuyPageCartDisplay cart={cart} />
    </div>
  );
};

export default BuyPage;
