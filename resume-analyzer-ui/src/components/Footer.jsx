import React from "react";
import { ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-slate-950 rounded-sm" />
              </div>
              CURRIX
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
            Build a standout resume that showcases your skills, experience, and career achievements.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a  className="hover:text-white cursor-pointer transition-colors">
                  About
                </a>
              </li>
              <li>
                <a  className="hover:text-white cursor-pointer transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a  className="hover:text-white cursor-pointer transition-colors">
                  Press
                </a>
              </li>
              <li>
                <a  className="hover:text-white cursor-pointer transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a className="hover:text-white cursor-pointer transition-colors">
                  Partners
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a className="hover:text-white cursor-pointer transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a className="hover:text-white cursor-pointer transition-colors">
                  Safety Information
                </a>
              </li>
              <li>
                <a className="hover:text-white cursor-pointer transition-colors">
                  Cancellation Options
                </a>
              </li>
              <li>
                <a className="hover:text-white cursor-pointer transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a className="hover:text-white cursor-pointer transition-colors">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe to our newsletter for travel inspiration and special
              offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white text-slate-900 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-black text-white p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
