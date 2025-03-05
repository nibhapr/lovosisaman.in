import React from 'react';
import Link from 'next/link';

interface Service {
  title: string;
  description: string;
  icon?: string;
  path?: string;
}

const services: Service[] = [
  {
    title: "IT Services",
    description: "Full-stack software development for custom applications, including enterprise solutions, mobile apps, and embedded systems. Focus on user-friendly interfaces and seamless functionality across platforms.",
    icon: "💻",
    path: "/services/it-services"
  },
  {
    title: "Electronics Manufacturing",
    description: "Production of educational tools and devices aimed at enhancing learning experiences. Focus on interactive, durable, and customizable solutions for schools, universities, and training centers.",
    icon: "🔧",
    path: "/services/electronics-manufacturing"
  }
];

const ServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-48 h-48 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
            <div className="w-48 h-48 bg-purple-100 rounded-full filter blur-3xl opacity-30 -ml-10"></div>
          </div>
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 sm:text-6xl">
            Our Services
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transforming ideas into reality through cutting-edge IT solutions and precision electronics manufacturing - where innovation meets excellence to revolutionize your business
          </p>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-16 sm:grid-cols-2">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-12 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100/20"
            >
              <div className="text-6xl mb-8 bg-gradient-to-br from-blue-100 to-purple-100 w-24 h-24 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {service.description}
              </p>
              <Link href={service.path || '#'}>
                <button className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center group">
                  Learn More
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
