import { Link } from 'react-router-dom';
import { Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold text-blue-400 mb-4">PDF<span className="text-white">API</span></h3>
          <p className="text-slate-400 text-sm">
            Automated PDF generation for developers.
          </p>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="font-bold text-lg mb-4">Product</h4>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li><Link to="/features" className="hover:text-blue-400">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-blue-400">Pricing</Link></li>
            <li><Link to="/docs" className="hover:text-blue-400">API Docs</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="font-bold text-lg mb-4">Company</h4>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li><Link to="/about" className="hover:text-blue-400">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-blue-400">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="font-bold text-lg mb-4">Connect</h4>
          <div className="flex space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400">
              <Github size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400">
              <Twitter size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} PDFAPI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;