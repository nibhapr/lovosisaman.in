"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faThreads, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Successfully subscribed to newsletter!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe');
      }
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setStatus('error');
      setMessage('Failed to subscribe');
    }

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 3000);
  };

  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent mb-2">Subscribe to our Newsletter</h3>
            <p className="text-gray-500 mb-4">Stay updated with our latest news and updates</p>
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 text-white placeholder-gray-600"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-md hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {message && (
              <p className={`mt-2 text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">
              lovosis
            </Link>
            <p className="text-gray-500 mt-2">
              Transforming ideas into digital reality with innovative solutions.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Links */}
              <a href="#" className="text-zinc-600 hover:text-[#1877F2] transition-colors duration-300">
                <FontAwesomeIcon icon={faFacebook} className="h-8 w-8" />
              </a>
              <a href="#" className="text-zinc-600 hover:text-[#E4405F] transition-colors duration-300">
                <FontAwesomeIcon icon={faInstagram} className="h-8 w-8" />
              </a>
              <a href="#" className="text-zinc-600 hover:text-[#FFFFFF] transition-colors duration-300">
                <FontAwesomeIcon icon={faThreads} className="h-8 w-8" />
              </a>
              <a href="#" className="text-zinc-600 hover:text-[#0A66C2] transition-colors duration-300">
                <FontAwesomeIcon icon={faLinkedin} className="h-8 w-8" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['About', 'Services', 'Products', 'Contact', 'Gallery', 'Careers'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-gray-500 hover:text-blue-400 transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blogs"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap.xml"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-500">
              <li><a href="https://www.google.com/maps?q=4-72/2,+Swathi+Building,+3rd+Floor,+Opp.+Singapura+Garden,+1st+Main+Lakshmipura+Road,+Abbigere,+Bengaluru,+Karnataka+560090" target="_blank" className="hover:text-blue-400 transition-colors duration-300">4-72/2, Swathi Building, 3rd Floor, Opp. Singapura Garden, 1st Main Lakshmipura Road, Abbigere, Bengaluru, Karnataka 560090</a></li>
              <li>Email: <a href="mailto:info@lovosis.in" className="hover:text-blue-400 transition-colors duration-300">info@lovosis.in</a></li>
              <li>Email: <a href="mailto:lovosist@gmail.com" className="hover:text-blue-400 transition-colors duration-300">lovosist@gmail.com</a></li>
              <li>Phone: <a href="tel:+917012970281" className="hover:text-blue-400 transition-colors duration-300">+91 7012970281</a></li>
              <li>Phone: <a href="tel:+919747745544" className="hover:text-blue-400 transition-colors duration-300">+91 9747745544</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-900 mt-12 pt-8">
          <div className="text-center text-gray-600">
            <p>&copy; {currentYear} lovosis. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;