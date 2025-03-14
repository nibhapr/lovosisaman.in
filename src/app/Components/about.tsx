"use client";

import { motion } from 'framer-motion';
import { IoRocketOutline, IoLayersOutline, IoCodeSlashOutline, IoBarChartOutline } from 'react-icons/io5';
import Image from 'next/image';
import { useState } from 'react';

const About = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const services = [
    {
      icon: IoRocketOutline,
      title: "Educational Equipment",
      description: "Premium laboratory equipment for engineering colleges and technical schools, featuring digital oscilloscopes and electronic workbenches.",
      color: "from-blue-700 to-purple-700"
    },
    {
      icon: IoCodeSlashOutline,
      title: "Digital Solutions",
      description: "All-inclusive digital services spanning web design, marketing strategies, and SEO optimization to elevate your online presence.",
      color: "from-purple-700 to-pink-700"
    },
    {
      icon: IoLayersOutline,
      title: "Web Design",
      description: "Bespoke website development, e-commerce solutions, and mobile-responsive designs that transform visitors into loyal customers.",
      color: "from-pink-700 to-indigo-700"
    },
    {
      icon: IoBarChartOutline,
      title: "Digital Marketing",
      description: "Holistic digital marketing strategies, encompassing social media management, SEO optimization, and data-driven advertising campaigns.",
      color: "from-indigo-700 to-blue-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-8"
          >
            Discover Lovosis Technologies
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
          >
            Revolutionizing education and business through cutting-edge technology solutions and precision engineering
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 mx-auto max-w-4xl"
          >
            <Image
              src="/images/home/3.jpg" // Update with your image path
              alt="Lovosis Technologies"
              width={1200}
              height={800}
              className="rounded-3xl shadow-xl"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/60">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-10 shadow-xl"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-8">
              Our Mission
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              To empower educational institutions and businesses with state-of-the-art technology solutions that drive innovation, enhance learning experiences, and accelerate digital transformation.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-10 shadow-xl"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-8">
              Our Vision
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              To become the premier provider of innovative educational equipment and digital solutions, revolutionizing the way institutions teach and businesses operate in the digital era.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Our Core Services
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-700 text-xl max-w-3xl mx-auto"
            >
              We synergize innovation with expertise to deliver outstanding results across diverse domains
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
                className={`p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform border-2 ${
                  hoveredService === index 
                    ? `border-transparent bg-gradient-to-r ${service.color}`
                    : 'border-gray-200'
                }`}
              >
                <service.icon className={`w-16 h-16 mb-6 transition-colors ${
                  hoveredService === index ? 'text-white' : 'text-blue-700'
                }`} />
                <h3 className={`text-2xl font-semibold mb-4 transition-colors ${
                  hoveredService === index ? 'text-white' : 'text-gray-900'
                }`}>
                  {service.title}
                </h3>
                <p className={`text-lg transition-colors ${
                  hoveredService === index ? 'text-white' : 'text-gray-700'
                }`}>
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Equipment Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Educational Equipment Solutions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-700 text-xl max-w-3xl mx-auto"
            >
              High-quality equipment tailored for engineering colleges, polytechnics, and technical schools
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-8 bg-white rounded-3xl shadow-xl"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Digital Oscilloscopes</h3>
              <p className="text-gray-700 text-lg">
                High-precision tools for visualizing waveforms and examining electrical circuits in real-time
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-8 bg-white rounded-3xl shadow-xl"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Electronic Workbenches</h3>
              <p className="text-gray-700 text-lg">
                Packed with latest tools for building and testing electronic circuits safely and efficiently
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-8 bg-white rounded-3xl shadow-xl"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Electrical Workbenches</h3>
              <p className="text-gray-700 text-lg">
                Designed for electrical engineering experiments with built-in safety features
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Digital Solutions Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Comprehensive Digital Solutions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-700 text-xl max-w-3xl mx-auto"
            >
              Helping businesses thrive in the digital world with tailored solutions
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-8 bg-white rounded-3xl shadow-xl"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Web Design</h3>
              <p className="text-gray-700 text-lg">
                Custom, responsive websites that convert visitors into customers
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-8 bg-white rounded-3xl shadow-xl"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Digital Marketing</h3>
              <p className="text-gray-700 text-lg">
                Comprehensive strategies to boost visibility and conversions
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-8 bg-white rounded-3xl shadow-xl"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">SEO Services</h3>
              <p className="text-gray-700 text-lg">
                Proven techniques to improve search rankings and drive organic traffic
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-700 to-purple-700">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white mb-8"
          >
            Ready to Transform Your Institution or Business?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-white max-w-3xl mx-auto mb-12"
          >
            Contact us today to learn more about our solutions and how we can help you achieve your goals
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-700 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={() => {
              window.location.href = '/contact';
            }}
          >
            Get Started Now
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default About;
