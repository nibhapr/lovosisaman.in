"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { IoRocketOutline, IoLayersOutline, IoCodeSlashOutline, IoCheckmarkCircleOutline, IoBarChartOutline } from 'react-icons/io5';

// Updated features array with more detailed descriptions
const features = [
  {
    icon: IoRocketOutline,
    title: "Educational Equipment",
    description: "Specialized laboratory equipment for engineering colleges, polytechnics, and technical schools, including "
  },
  {
    icon: IoLayersOutline,
    title: "Testing & Measurement Equipment",
    description: "Professional-grade testing and measurement instruments for precise analysis, including oscilloscopes, multimeters, electronic workbenches, and signal generators."
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
    url: "/images/home/1.jpg",
    alt: "Educational Equipment",
    description: "State-of-the-art educational equipment for modern learning environments. Empowering students with hands-on experience."
  },
  {
    url: "/images/home/2.jpg",
    alt: "Testing & Measuring Equipment",
    description: "Precision testing and measuring equipment for accurate results. Industry-standard tools for professional applications."
  },
  {
    url: "/images/home/3.jpg",
    alt: "Software Solutions",
    description: "Innovative software solutions to streamline your operations. Custom development for your unique needs."
  },
  {
    url: "/images/home/4.jpg",
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
                {/* Remove Simple Gradient Overlay */}
                <div className="absolute inset-0">
                  <div className="relative h-full flex items-center justify-center">
                    {/* Remove gradient motion.div */}
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
                            className="bg-blue-50 rounded-lg p-3"
                          >
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
                      <div className="absolute inset-0 rounded-2xl overflow-hidden group">
                        <Image 
                          src={service.media.src}
                          alt={service.title}
                          fill
                          className="w-full h-full object-cover"
                          priority
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="grid md:grid-cols-2 gap-8 items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 rounded-[3rem] p-3"
          >
            {/* Content Section */}
            <div className="p-8 md:p-12 backdrop-blur-xl bg-white/90 rounded-2xl shadow-2xl">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-6">
                  Turn Dreams Into Digital Reality
                </h2>
                <p className="text-gray-700 text-xl mb-10 leading-relaxed">
                  Join us on an extraordinary journey where innovation meets imagination. Let's craft something truly remarkable together.
                </p>
              </motion.div>

              {/* Animated CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 mr-3">Let's Create Magic</span>
                  <motion.span
                    animate={{
                      x: [0, 8, 0],
                      rotate: [0, 360, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="relative z-10"
                  >
                    <IoRocketOutline className="w-7 h-7" />
                  </motion.span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
              </motion.div>
            </div>

            {/* Dynamic Visual Experience */}
            <div className="relative h-full min-h-[500px] p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8 }}
                className="relative h-full rounded-3xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/videos/home/service/3.gif"
                  alt="Digital Experience"
                  fill
                  unoptimized
                  className="w-full h-full object-cover"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
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
          <div className="absolute top-1/3 left-1/4 w-[30rem] h-[30rem] bg-indigo-300/20 rounded-full mix-blend-multiply blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-[35rem] h-[35rem] bg-fuchsia-300/20 rounded-full mix-blend-multiply blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-[25rem] h-[25rem] bg-purple-300/20 rounded-full mix-blend-multiply blur-3xl" />
        </motion.div>
      </section>
    </div>
  );
}
