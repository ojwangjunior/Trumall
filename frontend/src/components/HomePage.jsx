import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import CategoryMenu from "./CategoryMenu";

const featuredProducts = [
  {
    id: 1,
    name: "iPhone 14 Pro",
    price: "$999",
    originalPrice: "$1099",
    image: "https://cdsassets.apple.com/live/SZLF0YNV/images/sp/111846_sp875-sp876-iphone14-pro-promax.png",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Samsung Galaxy S23",
    price: "$899",
    originalPrice: "$999",
    image: "https://phonehubkenya.co.ke/wp-content/uploads/2023/04/Samsung-Galaxy-S23-Ultra.jpg",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    price: "$349",
    originalPrice: "$399",
    image: "https://m.media-amazon.com/images/I/61MgtmigsJL._UF894,1000_QL80_.jpg",
    rating: 4.9,
  },
  {
    id: 4,
    name: "MacBook Air M2",
    price: "$1199",
    originalPrice: "$1299",
    image: "https://www.cordobadigital.net/wp-content/uploads/2025/05/apple-a268.webp",
    rating: 4.7,
  },
];

const HomePage = () => {
  return (
    <div className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <CategoryMenu />
          </div>
          <div className="col-span-9">
            <div className="bg-white rounded-md shadow-md p-4">
              <img
                src="https://via.placeholder.com/800x400?text=Flash+Sale"
                alt="Flash Sale"
                className="w-full rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
