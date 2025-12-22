import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

          {/* Logo and Description */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mr-3"></div>
              <span className="text-2xl font-bold">CityFix</span>
            </div>
            <p className="text-gray-400">
              Empowering citizens to build better cities through collaborative
              issue reporting and resolution.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white">Report an Issue</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Browse Issues</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">How It Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-6">Categories</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white">Road & Transport</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Sanitation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Water Supply</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Public Safety</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8" />
                </svg>
                support@cityfix.com
              </li>

              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28l1.498 4.493" />
                </svg>
                +1 (555) 123-4567
              </li>

              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 11a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
                123 City Hall, Your City
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-gray-800">
          <p className="text-gray-400">
            © 2024 CityFix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;