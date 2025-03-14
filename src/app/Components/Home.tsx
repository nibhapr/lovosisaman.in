"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { IoRocketOutline, IoLayersOutline, IoCodeSlashOutline, IoCheckmarkCircleOutline, IoTimeOutline, IoBarChartOutline, IoPeopleOutline, IoCloudOutline } from 'react-icons/io5';

// Updated features array with more detailed descriptions
const features = [
  {
    icon: IoRocketOutline,
    title: "Educational Equipment",
    description: "Specialized laboratory equipment for engineering colleges, polytechnics, and technical schools, including digital oscilloscopes and electronic workbenches."
  },
  {
    icon: IoLayersOutline,
    title: "Laboratory Solutions",
    description: "Comprehensive workbench setups for electrical and electronic experiments, featuring built-in safety features and testing equipment."
  },
  {
    icon: IoCodeSlashOutline,
    title: "Web Design & Development",
    description: "Custom website creation, e-commerce solutions, and mobile-responsive designs that convert visitors into customers."
  },
  {
    icon: IoBarChartOutline,
    title: "Digital Marketing & SEO",
    description: "Comprehensive digital marketing strategies, including social media management, SEO optimization, and targeted advertising campaigns."
  }
];

// Combined slider data array
const sliderData = [
  {
    url: "/images/home/2.jpg",
    alt: "Educational Equipment",
    description: "State-of-the-art educational equipment for modern learning environments. Empowering students with hands-on experience."
  },
  {
    url: "/images/home/3.jpg",
    alt: "Testing & Measuring Equipment",
    description: "Precision testing and measuring equipment for accurate results. Industry-standard tools for professional applications."
  },
  {
    url: "/images/home/4.jpg",
    alt: "Software Solutions",
    description: "Innovative software solutions to streamline your operations. Custom development for your unique needs."
  },
  {
    url: "/images/home/5.jpg",
    alt: "Digital Marketing & SEO",
    description: "Comprehensive digital marketing strategies and SEO services to boost your online presence and drive business growth."
  }
];

// Add service details for expanded sections
const serviceDetails = [
  {
    title: "Laboratory Equipment",
    description: "Our range includes digital oscilloscopes for signal analysis, electronic workbenches for circuit testing, and electrical workbenches for power systems experiments.",
    features: ["Digital Oscilloscopes", "Electronic Workbenches", "Electrical Test Equipment"],
    link: "/services/electronics-manufacturing"
  },
  {
    title: "Digital Solutions",
    description: "Comprehensive digital services including web design, marketing strategies, and SEO optimization to boost your online presence.",
    features: ["Custom Website Development", "Social Media Marketing", "SEO Services"],
    link: "/services/it-services"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section with Image Slider */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Image Slider */}
          <div className="relative w-full h-[500px] mb-12 rounded-2xl overflow-hidden">
            {sliderData.map((slide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: currentSlide === index ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.url}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Simple Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                  <div className="relative h-full flex items-center justify-center">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
                    />
                  </div>
                </div>

                {/* Text overlay */}
                <div className="absolute bottom-16 left-8 right-8 text-white z-10">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                  >
                    {slide.alt}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-lg md:text-xl text-gray-200 max-w-2xl"
                  >
                    {slide.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}

            {/* Slider indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {sliderData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Section - Enhanced with animations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We combine innovation with expertise to deliver exceptional results
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Detailed Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for educational institutions and businesses
            </p>
          </div>

          {serviceDetails.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-16 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-1">
                <div className="bg-white rounded-3xl p-8 sm:p-12 hover:shadow-xl transition-shadow duration-300">
                  <div className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                    {/* Content Section */}
                    <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-6 text-lg">
                        {service.description}
                      </p>
                      <div className="space-y-4">
                        {service.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="flex items-center space-x-3 bg-blue-50 rounded-lg p-3"
                          >
                            <div className="flex-shrink-0">
                              <IoCheckmarkCircleOutline className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-gray-700 font-medium">
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                      <Link
                        href={service.link}
                        className="inline-flex items-center mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                      >
                        Learn More
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>

                    {/* Image/Icon Section */}
                    <div className={`relative h-64 md:h-full ${index % 2 === 1 ? 'md:col-start-1' : ''}`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {index === 0 ? (
                            <IoLayersOutline className="w-24 h-24 text-blue-600/40" />
                          ) : (
                            <IoCodeSlashOutline className="w-24 h-24 text-purple-600/40" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section - Enhanced Interactive Version with Images */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-8 items-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-2"
          >
            {/* Content Section */}
            <div className="p-8 md:p-12 bg-white rounded-2xl">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Let's Create Something Amazing Together
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Transform your ideas into reality with our expert team and cutting-edge solutions.
                </p>
              </motion.div>

              {/* Feature Cards with Images */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { 
                    icon: IoRocketOutline, 
                    text: "Fast Delivery", 
                    color: "from-blue-500 to-blue-600",
                    image: "/images/home/2.jpg"
                  },
                  { 
                    icon: IoLayersOutline, 
                    text: "Quality First", 
                    color: "from-purple-500 to-purple-600",
                    image: "/images/home/5.jpg"
                  },
                  { 
                    icon: IoTimeOutline, 
                    text: "24/7 Support", 
                    color: "from-blue-500 to-blue-600",
                    image: "/images/home/3.jpg"
                  },
                  { 
                    icon: IoBarChartOutline, 
                    text: "Growth Focus", 
                    color: "from-purple-500 to-purple-600",
                    image: "/images/home/4.jpg"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`relative p-4 rounded-xl bg-gradient-to-r ${item.color} group cursor-pointer overflow-hidden`}
                  >
                    <div className="relative z-10 bg-white/90 rounded-lg p-4 transition-all duration-300 group-hover:bg-white/95">
                      <item.icon className="w-8 h-8 mb-2 text-blue-600" />
                      <p className="font-semibold text-gray-800">{item.text}</p>
                    </div>
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                      <Image
                        src={item.image}
                        alt={item.text}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/about"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300"
                >
                  <span className="mr-2">Start Your Journey</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.span>
                </Link>
              </motion.div>
            </div>

            {/* Interactive Visual Section with Main Image */}
            <div className="relative h-full min-h-[400px] p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-full rounded-2xl overflow-hidden"
              >
                {/* Main Feature Image */}
                <Image
                  src="/images/home/5.jpg"
                  alt="Innovation and Technology"
                  fill
                  className="object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white text-4xl font-bold text-center max-w-lg">
                      Discover the Power of Innovation and Technology
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Background Elements */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full mix-blend-multiply" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply" />
        </motion.div>
      </section>
    </div>
  );
}
