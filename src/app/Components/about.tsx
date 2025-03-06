"use client";

import { IoRocketOutline, IoHeartOutline, IoTimeOutline, IoTrophyOutline, IoSchoolOutline, IoSpeedometerOutline, IoVideocamOutline, IoCubeOutline, IoCodeSlashOutline, IoMegaphoneOutline, IoDesktopOutline, IoSearchOutline } from "react-icons/io5";
import Image from 'next/image';

const stats = [
  { number: "10+", label: "Years Experience", icon: IoTimeOutline },
  { number: "500+", label: "Projects Delivered", icon: IoRocketOutline },
  { number: "200+", label: "Happy Clients", icon: IoHeartOutline },
  { number: "8", label: "Core Services", icon: IoTrophyOutline },
];

const services = [
  {
    name: "Educational Equipment",
    description: "Manufacturing interactive and durable educational tools for schools and universities.",
    icon: IoSchoolOutline
  },
  {
    name: "Testing & Measuring",
    description: "Precision instruments for electrical, mechanical, and physical testing.",
    icon: IoSpeedometerOutline
  },
  {
    name: "CCTV & AV Solutions",
    description: "End-to-end security and audiovisual solutions for all environments.",
    icon: IoVideocamOutline
  },
  {
    name: "Custom Enclosures",
    description: "Specialized enclosures for electronic devices and equipment protection.",
    icon: IoCubeOutline
  },
  {
    name: "Software Development",
    description: "Full-stack development for enterprise solutions and mobile applications.",
    icon: IoCodeSlashOutline
  },
  {
    name: "Digital Marketing",
    description: "Comprehensive digital marketing services for brand growth.",
    icon: IoMegaphoneOutline
  },
  {
    name: "Website Design",
    description: "Responsive and intuitive website solutions for businesses.",
    icon: IoDesktopOutline
  },
  {
    name: "SEO Analysis",
    description: "Data-driven SEO strategies for improved online visibility.",
    icon: IoSearchOutline
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            About Lovosis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are a passionate team of developers, designers, and innovators dedicated to creating exceptional digital experiences that transform businesses.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <stat.icon className="w-10 h-10 mx-auto mb-4 text-blue-600" />
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                At Lovosis Technology, we are committed to delivering innovative solutions across multiple sectors, from educational equipment manufacturing to cutting-edge software development and digital services.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We specialize in creating high-quality, durable products and offering comprehensive services that cater to the diverse needs of our clients, from educational institutions to businesses seeking digital transformation.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about/team-collaboration.jpg"
                  alt="Team collaboration"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Services
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <service.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
