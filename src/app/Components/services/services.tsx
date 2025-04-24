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
    <div className="min-h-screen bg-black py-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center relative mb-20">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-56 h-56 bg-blue-900/20 rounded-full filter blur-3xl opacity-40"></div>
            <div className="w-56 h-56 bg-indigo-900/20 rounded-full filter blur-3xl opacity-40 -ml-12"></div>
          </div>
          <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 sm:text-7xl">
            Our Services
          </h2>
          <p className="mt-8 text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Transforming ideas into reality through cutting-edge IT solutions and precision electronics manufacturing - where innovation meets excellence to revolutionize your business
          </p>
        </div>

        <div className="mt-28 grid grid-cols-1 gap-20 sm:grid-cols-2">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-14 hover:shadow-3xl transform hover:-translate-y-3 transition-all duration-500 border-2 border-zinc-800/30"
            >
              <div className="text-7xl mb-10 bg-gradient-to-br from-blue-900/50 to-indigo-900/50 w-32 h-32 rounded-3xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                {service.icon}
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-6">
                {service.title}
              </h3>
              <p className="text-gray-300 leading-relaxed text-xl">
                {service.description}
              </p>
              <Link 
                href={service.path || '#'} 
                className="inline-block"
                prefetch={true}
                passHref
              >
                <div className="mt-10 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-md hover:shadow-xl hover:shadow-blue-500/10 flex items-center gap-3 text-lg transition-all duration-300 ease-in-out">
                  Learn More
                  <svg 
                    className="w-6 h-6 transition-transform duration-300 ease-in-out group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
