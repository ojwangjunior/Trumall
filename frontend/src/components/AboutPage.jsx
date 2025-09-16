
import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">About TrustMall</h1>
        <div className="max-w-3xl mx-auto text-lg text-gray-700">
          <p className="mb-6">
            TrustMall is a revolutionary decentralized marketplace built on blockchain technology to address the fundamental challenges of traditional e-commerce. Our mission is to create a global ecosystem for trade that is transparent, efficient, and fair for both buyers and sellers.
          </p>
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="mb-6">
            We envision a world where online trade is free from the control of centralized intermediaries, where users have full ownership of their data, and where trust is programmatically guaranteed. By leveraging the power of smart contracts and decentralized identity, we are making this vision a reality.
          </p>
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          <ul className="list-disc list-inside mb-6">
            <li className="mb-2"><strong>Decentralized Transactions:</strong> Secure, automated payments without intermediaries.</li>
            <li className="mb-2"><strong>Low Fees:</strong> Minimal transaction costs, leading to fairer prices and higher profits.</li>
            <li className="mb-2"><strong>Transparency & Trust:</strong> Immutable records of products, reviews, and reputations.</li>
            <li className="mb-2"><strong>Global Payments:</strong> Instant, borderless transactions using cryptocurrency.</li>
            <li className="mb-2"><strong>Data Sovereignty:</strong> Users control their own data and digital identity.</li>
            <li className="mb-2"><strong>Seller Autonomy:</strong> Freedom from arbitrary rules and restrictions.</li>
          </ul>
          <p>
            Join us on our journey to build a better future for e-commerce.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
