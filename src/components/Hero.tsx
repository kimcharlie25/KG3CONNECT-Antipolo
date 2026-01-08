import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-kg3-dark mb-6 animate-fade-in">
          Innovative IT Solutions for Your Business
          <span className="block text-kg3-orange mt-2">KG3CONNECT-Antipolo</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up">
          Empowering your digital transformation with cutting-edge technology and reliable support.
        </p>
        <div className="flex justify-center">
          <a
            href="#ramen"
            className="bg-kg3-orange text-white px-8 py-3 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg hover:shadow-xl"
          >
            Explore Services
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;