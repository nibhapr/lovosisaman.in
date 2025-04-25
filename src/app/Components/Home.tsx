"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { IoRocketOutline, IoLayersOutline, IoCodeSlashOutline, IoBarChartOutline } from 'react-icons/io5';
import img1 from "../../../public/images/home/1.jpg";
import img2 from "../../../public/images/home/2.jpg";
import img3 from "../../../public/images/home/2.jpg";
import img4 from "../../../public/images/home/4.jpg";

// Updated features array with more detailed descriptions
const features = [
  {
    icon: IoRocketOutline,
    title: "Educational Equipment",
    description: "Cutting-edge laboratory equipment for engineering colleges, polytechnics, and industrial training institutes. Empowering the next generation of innovators.",
    bgGradient: "from-blue-600/20 to-cyan-600/20"
  },
  {
    icon: IoLayersOutline,
    title: "Testing & Measurement Equipment",
    description: "Professional-grade testing and measurement instruments for precise analysis, including oscilloscopes, multimeters, electronic workbenches, and signal generators.",
    bgGradient: "from-purple-600/20 to-pink-600/20"
  },
  {
    icon: IoCodeSlashOutline,
    title: "Web Design & Development",
    description: "Custom website creation, e-commerce solutions, and mobile-responsive designs that convert visitors into customers.",
    bgGradient: "from-emerald-600/20 to-teal-600/20"
  },
  {
    icon: IoBarChartOutline,
    title: "Digital Marketing & SEO",
    description: "Comprehensive digital marketing strategies, including social media management, SEO optimization, and targeted advertising campaigns.",
    bgGradient: "from-orange-600/20 to-red-600/20"
  }
];

// Combined slider data array
const sliderData = [
  {
    url: img1.src,
    alt: "Educational Equipment",
    description: "State-of-the-art educational equipment for modern learning environments. Empowering students with hands-on experience."
  },
  {
    url: img2.src,
    alt: "Testing & Measuring Equipment",
    description: "Precision testing and measuring equipment for accurate results. Industry-standard tools for professional applications."
  },
  {
    url: img3.src,
    alt: "Software Solutions",
    description: "Innovative software solutions to streamline your operations. Custom development for your unique needs."
  },
  {
    url: img4.src,
    alt: "Digital Marketing & SEO",
    description: "Comprehensive digital marketing strategies and SEO services to boost your online presence and drive business growth."
  }
];

// Add service details for expanded sections
const serviceDetails = [
  {
    title: "Educational and Testing Equipment",
    description: "Our range includes advanced testing equipment for educational institutions, featuring digital measurement tools, electronic testing stations, and comprehensive power analysis systems.",
    features: ["Educational Testing Tools", "Measurement Equipment", "Power Analysis Systems"],
    link: "/services/electronics-manufacturing",
    media: {
      type: "video",
      src: "/videos/home/service/2.gif",
    }
  },
  {
    title: "Digital Solutions",
    description: "Comprehensive digital services including web design, marketing strategies, and SEO optimization to boost your online presence.",
    features: ["Custom Website Development", "Social Media Marketing", "SEO Services"],
    link: "/services/it-services",
    media: {
      type: "video",
      src: "/videos/home/service/1.gif",
    }
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Image Slider */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Image Slider */}
          <div className="relative w-full h-[500px] mb-8 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800/30">
            {/* Navigation Buttons */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            {sliderData.map((slide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ 
                  opacity: currentSlide === index ? 1 : 0,
                  scale: currentSlide === index ? 1 : 1.1
                }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.url}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                  >
                    {slide.alt}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed"
                  >
                    {slide.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}

            {/* Enhanced Slider indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
              {sliderData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    currentSlide === index 
                      ? 'w-8 bg-white' 
                      : 'w-4 bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-800/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-700/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4"
            >
              Why Choose Us
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
            >
              We combine innovation with expertise to deliver exceptional results that exceed expectations
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl shadow-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black backdrop-blur-xl hover:scale-105 transition-all duration-500"
              >
                <div className="bg-gradient-to-br from-blue-900 to-black p-3 rounded-xl mb-4 inline-block">
                  <feature.icon className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-blue-400 mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Detailed Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
              Our Services
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive solutions for educational institutions and businesses
            </p>
          </div>

          {serviceDetails.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-zinc-900 to-black rounded-2xl p-1">
                <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
                  <div className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                    {/* Content Section */}
                    <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                      <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 mb-6 text-lg">
                        {service.description}
                      </p>
                      <div className="space-y-4">
                        {service.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-gray-700/50 rounded-lg p-3"
                          >
                            <span className="text-gray-300 font-medium">
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                      <Link
                        href={service.link}
                        className="inline-flex items-center mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                      >
                        Learn More
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>

                    {/* Image/Icon Section */}
                    <div className={`relative h-64 md:h-full ${index % 2 === 1 ? 'md:col-start-1' : ''}`}>
                      <div className="absolute inset-0 rounded-2xl overflow-hidden group">
                        <Image
                          src={service.media.src}
                          alt={service.title}
                          fill
                          className="w-full h-full object-cover"
                          priority
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Immersive Interactive Experience Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="grid md:grid-cols-2 gap-8 items-center bg-gradient-to-br from-zinc-900 to-black rounded-[2rem] p-4 border border-zinc-800/30 shadow-2xl"
          >
            {/* Content Section */}
            <div className="p-6 md:p-8 backdrop-blur-xl rounded-xl">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 leading-tight">
                  Turn Dreams Into Digital Reality
                </h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Join us on an extraordinary journey where innovation meets imagination. Let's craft something truly remarkable together.
                </p>
              </motion.div>

              {/* Enhanced CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center px-12 py-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white rounded-full font-bold text-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  <span className="relative z-10 mr-4">Let's Create Magic</span>
                  <motion.span
                    animate={{
                      x: [0, 8, 0],
                      rotate: [0, 360, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="relative z-10"
                  >
                    <IoRocketOutline className="w-8 h-8" />
                  </motion.span>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </motion.div>
            </div>

            {/* Enhanced Image Section */}
            <div className="relative h-full min-h-[500px] p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8 }}
                className="relative h-full rounded-3xl overflow-hidden shadow-2xl border border-gray-800/30"
              >
                <Image
                  src="/images/home/5.jpg"
                  alt="Digital Experience Image"
                  fill
                  className="w-full h-full object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Animated Background */}
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute top-1/3 left-1/4 w-[30rem] h-[30rem] bg-blue-900/20 rounded-full mix-blend-multiply blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-[35rem] h-[35rem] bg-blue-800/20 rounded-full mix-blend-multiply blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-[25rem] h-[25rem] bg-blue-700/20 rounded-full mix-blend-multiply blur-3xl" />
        </motion.div>
      </section>
    </div>
  );
}
