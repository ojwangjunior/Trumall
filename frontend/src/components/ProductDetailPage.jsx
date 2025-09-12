import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Rating from "./Rating";
import { CartContext } from "../context/cart";

// Mock data - in a real app, you would fetch this based on the id
const products = [
  {
    id: 1,
    name: "iPhone 14 Pro",
    price: "$999",
    originalPrice: "$1099",
    image:
      "https://cdsassets.apple.com/live/SZLF0YNV/images/sp/111846_sp875-sp876-iphone14-pro-promax.png",
    rating: 4.5,
    reviews: 120,
    description:
      "The iPhone 14 Pro is a stunning device with a powerful A16 Bionic chip, a beautiful Super Retina XDR display, and a pro-level camera system.",
    specifications: [
      { name: "Brand", value: "Apple" },
      { name: "Display", value: "6.1-inch Super Retina XDR" },
      { name: "Chip", value: "A16 Bionic" },
      { name: "Camera", value: "48MP Main, 12MP Ultra Wide, 12MP Telephoto" },
    ],
  },
  {
    id: 2,
    name: "Samsung Galaxy S23",
    price: "$899",
    originalPrice: "$999",
    image:
      "https://phonehubkenya.co.ke/wp-content/uploads/2023/04/Samsung-Galaxy-S23-Ultra.jpg",
    rating: 4.8,
    reviews: 98,
    description:
      "The Samsung Galaxy S23 is a premium Android phone with a stunning Dynamic AMOLED 2X display, a powerful Snapdragon 8 Gen 2 for Galaxy chip, and a versatile camera system.",
    specifications: [
      { name: "Brand", value: "Samsung" },
      { name: "Display", value: "6.8-inch Dynamic AMOLED 2X" },
      { name: "Chip", value: "Snapdragon 8 Gen 2 for Galaxy" },
      { name: "Camera", value: "200MP Main, 12MP Ultra Wide, 10MP Telephoto" },
    ],
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    price: "$349",
    originalPrice: "$399",
    image:
      "https://m.media-amazon.com/images/I/61MgtmigsJL._UF894,1000_QL80_.jpg",
    rating: 4.9,
    reviews: 250,
    description:
      "The Sony WH-1000XM5 are the best noise-canceling headphones on the market, with a comfortable design, excellent sound quality, and industry-leading noise cancellation.",
    specifications: [
      { name: "Brand", value: "Sony" },
      { name: "Type", value: "Over-ear" },
      { name: "Noise Cancellation", value: "Industry-leading" },
      { name: "Battery Life", value: "Up to 30 hours" },
    ],
  },
  {
    id: 4,
    name: "MacBook Air M2",
    price: "$1199",
    originalPrice: "$1299",
    image:
      "https://www.cordobadigital.net/wp-content/uploads/2025/05/apple-a268.webp",
    rating: 4.7,
    reviews: 150,
    description:
      "The MacBook Air M2 is a powerful and portable laptop with a stunning Liquid Retina display, the powerful M2 chip, and a fanless design.",
    specifications: [
      { name: "Brand", value: "Apple" },
      { name: "Display", value: "13.6-inch Liquid Retina" },
      { name: "Chip", value: "M2" },
      { name: "Battery Life", value: "Up to 18 hours" },
    ],
  },
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    console.log("Adding to cart from ProductDetailPage:", {
      ...product,
      quantity,
    });
    addToCart({ ...product, quantity });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <Rating rating={product.rating} />
            <span className="text-gray-500 ml-2">
              ({product.reviews} reviews)
            </span>
          </div>
          <div className="flex items-center mb-4">
            <span className="text-3xl font-bold text-orange">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through ml-2">
                {product.originalPrice}
              </span>
            )}
          </div>
          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="flex items-center mb-6">
            <span className="mr-4">Quantity:</span>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              min="1"
              className="w-16 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-orange text-white py-3 rounded-md hover:bg-orange-dark"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Specifications */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Specifications</h2>
        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
          {product.specifications.map((spec) => (
            <li key={spec.name} className="p-4 flex">
              <span className="font-bold w-1/3">{spec.name}</span>
              <span className="w-2/3">{spec.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductDetailPage;
