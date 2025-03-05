"use client";

import { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { BsTelephoneFill } from "react-icons/bs";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus("error");
    }
    setIsSubmitting(false);
    setTimeout(() => setSubmitStatus("idle"), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 sm:px-6">
      <main className="max-w-7xl mx-auto py-12 md:py-20">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have questions or want to collaborate? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <ContactCard
            icon={<MdOutlineEmail className="w-full h-full" />}
            title="Email Us"
            content={`<a href="mailto:info@lovosis.in" class="hover:text-blue-700">info@lovosis.in</a><br/><a href="mailto:lovosist@gmail.com" class="hover:text-blue-700">lovosist@gmail.com</a>`}
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          />
          <ContactCard
            icon={<IoLocationSharp className="w-full h-full" />}
            title="Visit Us"
            content="4-72/2, Swathi Building,<br/>3rd Floor, Opp. Singapura Garden,<br/>1st Main Road, Lakshmipura,<br/>Abbigere, Bengaluru,<br/>Karnataka 560090"
            bgColor="bg-indigo-100"
            textColor="text-indigo-600"
          />
          <ContactCard
            icon={<BsTelephoneFill className="w-full h-full" />}
            title="Call Us"
            content={`<a href="tel:+917012970281" class="hover:text-blue-700">+91 7012970281</a><br/><a href="tel:+919747745544" class="hover:text-blue-700">+91 9747745544</a>`}
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          />
        </div>

        {/* Form and Map Container */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput
                  label="Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <FormInput
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
              <FormInput
                label="Subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
              />
              <FormTextArea
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 ease-in-out shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {submitStatus === "success" && (
                <div className="text-green-600 text-center py-2 bg-green-50 rounded-lg">
                  Message sent successfully!
                </div>
              )}
              {submitStatus === "error" && (
                <div className="text-red-600 text-center py-2 bg-red-50 rounded-lg">
                  Failed to send message. Please try again.
                </div>
              )}
            </form>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Find Us</h2>
            <div className="w-full h-[500px] rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.4851882392584!2d77.53277827516318!3d13.068673887276683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae23ee22c0d0d9%3A0x7c75d6374c699d3e!2s4-72%2F2%2C%201st%20Main%20Rd%2C%20Lakshmipura%2C%20Abbigere%2C%20Bengaluru%2C%20Karnataka%20560090!5e0!3m2!1sen!2sin!4v1710312671044!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ContactCard component
const ContactCard = ({
  icon,
  title,
  content,
  bgColor,
  textColor,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  bgColor: string;
  textColor: string;
}) => (
  <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
    <div
      className={`${bgColor} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4`}
    >
      <div className={`w-8 h-8 ${textColor}`}>{icon}</div>
    </div>
    <h3 className={`text-xl ${textColor} font-semibold text-center mb-2`}>
      {title}
    </h3>
    <p
      className="text-gray-600 text-center"
      dangerouslySetInnerHTML={{ __html: content }}
    ></p>
  </div>
);

// FormInput component
const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-gray-700 mb-2"
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ease-in-out"
      required
    />
  </div>
);

// FormTextArea component
const FormTextArea = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-gray-700 mb-2"
    >
      {label}
    </label>
    <textarea
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      rows={4}
      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ease-in-out"
      required
    />
  </div>
);
