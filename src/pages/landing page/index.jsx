import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';

import LogoCircle from "../../assets/img/fizzpan_logo.png";
import FishLarge from "../../assets/img/taiyaki.png";
import FishCream from "../../assets/img/teks.png";
import BannerBackground from "../../assets/img/shape.png";
import AboutBackground from "../../assets/img/brown.png";
import TaiyakiBowl from "../../assets/img/taiyaki2.png";

const FizzpanLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white overflow-hidden scroll-smooth">
      {/* Navbar with shadow */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src={LogoCircle} 
                alt="Fizzpan Logo" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="text-2xl lg:text-3xl font-bold text-black">FIZZPAN</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#beranda" className="text-black hover:text-[#A1887F] transition-colors font-medium">
                Beranda
              </a>
              <a href="#tentang" className="text-black hover:text-[#A1887F] transition-colors font-medium">
                Tentang
              </a>
              <a href="#produk" className="text-black hover:text-[#A1887F] transition-colors font-medium">
                Produk
              </a>
              <a href="#contact" className="text-black hover:text-[#A1887F] transition-colors font-medium">
                Contact
              </a>
              <Link to="/register">
                <button className="px-5 py-2 text-[#A1887F] border-2 border-[#A1887F] rounded-full hover:bg-[#A1887F] hover:text-white transition-all font-medium">
                    Daftar
                </button>
                </Link>

                <Link to="/login">
                <button className="px-6 py-2 bg-[#A1887F] text-white rounded-full hover:bg-[#8D6E63] transition-all font-medium">
                    Masuk
                </button>
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-black"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-6 pb-4 flex flex-col gap-4">
              <a href="#beranda" className="text-black hover:text-[#A1887F] font-medium">Beranda</a>
              <a href="#tentang" className="text-black hover:text-[#A1887F] font-medium">Tentang</a>
              <a href="#produk" className="text-black hover:text-[#A1887F] font-medium">Produk</a>
              <a href="#contact" className="text-black hover:text-[#A1887F] font-medium">Contact</a>
              <button className="px-5 py-2 text-[#A1887F] border-2 border-[#A1887F] rounded-full w-full">
                Daftar
              </button>
              <button className="px-6 py-2 bg-[#A1887F] text-white rounded-full w-full">
                Masuk
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="beranda" className="relative pt-24 pb-4 lg:pt-32 lg:pb-12 min-h-screen overflow-visible bg-white">
        {/* Shape Background - Left Side (Layered Curves) */}
        <div className="home-bannerImage-container absolute top-16 left-0 w-1/3 h-auto pointer-events-none z-0">
          <img src={BannerBackground} alt="" className="w-full h-auto" />
        </div>

        {/* Shape Background - Right Side (Blob) - Extended Height */}
        <div className="about-background-image-container absolute top-32 right-0 w-1/2 pointer-events-none z-0" 
             style={{ height: 'calc(100vh + 400px)' }}>
          <img src={AboutBackground} alt="" className="w-full h-full object-cover" />
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10 min-h-[calc(100vh-8rem)]">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-center lg:text-left lg:pl-16"
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-black leading-tight">
              An Authentic<br />
              <span className="text-black">Japanese Taste.</span>
            </h1>
            <p className="text-lg lg:text-xl text-black leading-relaxed max-w-xl mx-auto lg:mx-0">
              Crispy, fish-shaped cakes with a delicious filling, made with the finest ingredients for happiness in every bite.
            </p>
          </motion.div>

          {/* Right Content - Fish Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            <motion.img 
              src={FishLarge}
              alt="Taiyaki"
              className="w-full max-w-md lg:max-w-lg h-auto object-contain relative z-10"
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="pt-4 pb-12 lg:pt-6 lg:pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-black mb-6">
              FIZZPAN?
            </h2>
            <p className="text-xl text-black font-bold mb-4">
              Taiyaki dengan twist rasa dan semangat lokal.
            </p>
            <p className="text-black leading-relaxed mb-8 text-base lg:text-lg">
              Fizzpan bukan sekadar taiyaki. Kami adalah perpaduan antara tradisi Jepang dan kreativitas rasa yang lahir dari tangan-tangan lokal. Dari bentuk ikoniknya yang menyerupai ikan, kami menghadirkan pengalaman baru dalam setiap gigitan manis, gurih, dan kadang mengejutkan.
            </p>
            <button className="bg-[#A1887F] text-white px-10 py-3 rounded-full inline-flex items-center gap-2 hover:bg-[#8D6E63] transition-all font-medium">
              Selengkapnya <ArrowRight size={20} />
            </button>
          </motion.div>

          {/* Right Content - Product Image in Bowl */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative flex justify-center lg:justify-end"
          >
            <img 
              src={TaiyakiBowl}
              alt="Fizzpan Products"
              className="w-full max-w-md lg:max-w-xl h-auto object-contain"
            />
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section id="produk" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">
              Produk Kami
            </h2>
            <p className="text-lg lg:text-xl text-black">
              Berbagai varian rasa yang menggugah selera
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Original Red Bean", desc: "Rasa klasik dengan isian kacang merah manis yang lembut" },
              { name: "Cheese Delight", desc: "Perpaduan sempurna keju yang creamy dan gurih" },
              { name: "Chocolate Dream", desc: "Cokelat premium yang meleleh di setiap gigitan" }
            ].map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-[#D4A574] to-[#A1887F] h-64 flex items-center justify-center p-8">
                  <img 
                    src={FishCream} 
                    alt={item.name} 
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <div className="p-6 lg:p-8">
                  <h3 className="text-2xl font-bold text-black mb-3">
                    {item.name}
                  </h3>
                  <p className="text-black mb-6 text-sm lg:text-base">
                    {item.desc}
                  </p>
                  <button className="w-full bg-[#A1887F] text-white py-3 rounded-full hover:bg-[#8D6E63] transition-all font-medium">
                    Pesan Sekarang
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
              Hubungi Kami
            </h2>
            <p className="text-lg lg:text-xl text-black mb-8">
              Ada pertanyaan? Kami siap membantu Anda!
            </p>
            <button className="bg-[#A1887F] text-white px-12 py-4 rounded-full text-lg hover:bg-[#8D6E63] transition-all font-medium">
              Kontak Sekarang
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#4A3428' }} className="text-white py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Logo Section */}
            <div className="flex justify-center md:justify-start">
              <img 
                src={LogoCircle} 
                alt="Fizzpan" 
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>

            {/* Social Media Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Sosial Media</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-3 text-gray-200 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-200 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-200 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>Twitter</span>
                </a>
              </div>
            </div>

            {/* Navigation Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Navigasi cepat</h3>
              <div className="space-y-3">
                <a href="#beranda" className="block text-gray-200 hover:text-white transition-colors">
                  Beranda
                </a>
                <a href="#tentang" className="block text-gray-200 hover:text-white transition-colors">
                  Tentang
                </a>
                <a href="#contact" className="block text-gray-200 hover:text-white transition-colors">
                  Hubungi Kami
                </a>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Informasi Kontak</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Whatsapp</p>
                    <p className="font-medium">0987654378</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Email</p>
                    <p className="font-medium">fizzpan@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Lokasi</p>
                    <p className="font-medium leading-relaxed">
                      JL. TELUK PACITAN ARJOSARI MALANG, Arjosari, Kec. Blimbing, Kota Malang, Jawa Timur.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="border-t border-gray-600 mt-10 pt-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
              </svg>
              <span>2025 FizzPan All rights reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FizzpanLanding;

