"use client";

import { motion } from "framer-motion";
import { IoCheckmarkCircleOutline, IoSettingsOutline, IoSpeedometerOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import Link from "next/link";

const features = [
  {
    title: "PCB Assembly",
    description: "Professional PCB assembly services with advanced SMT and through-hole technology for various applications.",
    icon: IoSettingsOutline,
  },
  {
    title: "Quality Testing",
    description: "Rigorous quality control and testing procedures to ensure reliable and durable electronic products.",
    icon: IoShieldCheckmarkOutline,
  },
  {
    title: "Rapid Prototyping",
    description: "Quick turnaround prototyping services to help bring your ideas to life faster.",
    icon: IoSpeedometerOutline,
  },
];

const services = [
  {
    title: "Surface Mount Technology (SMT)",
    description: "State-of-the-art SMT assembly with high-precision component placement.",
    benefits: [
      "High-density board assembly",
      "Automated optical inspection",
      "Lead-free soldering options",
      "Multi-layer PCB capability"
    ]
  },
  {
    title: "Through-hole Assembly",
    description: "Traditional through-hole assembly for specialized electronic components.",
    benefits: [
      "Manual and automated assembly",
      "Mixed technology boards",
      "Custom component fitting",
      "High reliability connections"
    ]
  },
  {
    title: "Testing & Quality Assurance",
    description: "Comprehensive testing and quality control procedures.",
    benefits: [
      "Functional testing",
      "Environmental stress screening",
      "X-ray inspection",
      "Thermal testing"
    ]
  },
  {
    title: "Educational Equipment Manufacturing",
    description: "Production of high-quality educational tools and devices for enhanced learning experiences.",
    benefits: [
      "Interactive learning solutions",
      "Durable educational tools",
      "Customizable designs",
      "Solutions for all education levels"
    ]
  },
  {
    title: "Testing & Measuring Instruments",
    description: "Development of precision testing and measuring tools for various applications.",
    benefits: [
      "High-precision instruments",
      "Electrical testing tools",
      "Mechanical measurement devices",
      "Physical property analyzers"
    ]
  },
  {
    title: "CCTV & AV Solutions",
    description: "Comprehensive security and audiovisual solutions for various environments.",
    benefits: [
      "End-to-end system design",
      "Professional installation",
      "Customized security solutions",
      "Broadcasting equipment setup"
    ]
  },
  {
    title: "Custom Enclosures",
    description: "Specialized enclosure design and manufacturing for electronic equipment.",
    benefits: [
      "Custom design solutions",
      "Protection for sensitive equipment",
      "Various material options",
      "Environmental protection"
    ]
  }
];

export default function ElectronicsManufacturing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
          >
            Electronics Manufacturing Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Cutting-edge electronics manufacturing solutions with precision engineering and quality assurance
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Manufacturing Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <IoCheckmarkCircleOutline className="w-5 h-5 text-blue-600 mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Start Your Manufacturing Project?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact us today to discuss your electronics manufacturing needs
          </p>
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Get in Touch
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}
