

import React from 'react';
import { BUSINESS_INFO } from '../constants';
import { LogoIcon } from './icons/LogoIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.phone.replace(/\D/g, '')}?text=${encodeURIComponent(BUSINESS_INFO.whatsappMessage)}`;

  return (
    <footer className="bg-[--color-bg-secondary] text-[--color-text-secondary]">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 lg:col-span-1">
             <a href="#/" className="flex items-center space-x-2 text-2xl font-bold text-[--color-text-primary]">
                <LogoIcon />
                <span style={{fontFamily: 'var(--font-heading)'}}>{BUSINESS_INFO.name}</span>
            </a>
            <p className="mt-4 text-sm text-[--color-text-secondary]">
              Style That Speaks. From runway trends to timeless classics, find the perfect case that's uniquely you.
            </p>
            <div className="flex space-x-4 mt-6">
                <a href="https://www.facebook.com/share/1BkAG3Qvm8/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-[--color-text-muted] hover:text-[--color-text-primary] transition-colors" aria-label="Facebook">
                    <FacebookIcon className="w-6 h-6"/>
                </a>
                <a href="https://www.instagram.com/covercart_in?igsh=MW95ODFnNDFqaTdibw==" target="_blank" rel="noopener noreferrer" className="text-[--color-text-muted] hover:text-[--color-text-primary] transition-colors" aria-label="Instagram">
                    <InstagramIcon />
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-[--color-text-muted] hover:text-[--color-text-primary] transition-colors" aria-label="WhatsApp">
                    <WhatsAppIcon className="w-6 h-6"/>
                </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-[--color-text-primary] uppercase tracking-wider">Quick Links</h5>
            <ul className="mt-4 space-y-2">
              <li><a href="#products" className="text-[--color-text-secondary] hover:text-[--color-primary] hover:underline transition-colors text-sm">Collection</a></li>
              <li><a href="#/gallery" className="text-[--color-text-secondary] hover:text-[--color-primary] hover:underline transition-colors text-sm">Gallery</a></li>
              <li><a href="#/ai-designer" className="text-[--color-text-secondary] hover:text-[--color-primary] hover:underline transition-colors text-sm">AI Designer</a></li>
              <li><a href="#contact" className="text-[--color-text-secondary] hover:text-[--color-primary] hover:underline transition-colors text-sm">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-bold text-[--color-text-primary] uppercase tracking-wider">Customer Service</h5>
            <ul className="mt-4 space-y-2">
              <li><a href="#/orders" className="text-[--color-text-secondary] hover:text-[--color-primary] hover:underline transition-colors text-sm">Order Tracking</a></li>
              <li><a href="#/privacy" className="text-[--color-text-secondary] hover:text-[--color-primary] hover:underline transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#/terms" className="text-[--color-text-secondary] hover:text-[--color-primary] hover:underline transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#/refunds" className="text-[--color-text-secondary] hover:text-[--color-primary] hover:underline transition-colors text-sm">Refund Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="font-bold text-[--color-text-primary] uppercase tracking-wider">Stay Updated</h5>
            <p className="mt-4 text-sm text-[--color-text-secondary]">
              Get the latest news and special offers. (No spam, we promise!)
            </p>
            <form className="mt-4 flex">
              <input type="email" placeholder="Your email" className="w-full px-4 py-2 rounded-l-md bg-[--color-bg-primary] border border-[--color-border] text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]" />
              <button type="submit" className="bg-[--color-primary] hover:bg-[--color-primary-hover] text-[--color-primary-text] font-bold py-2 px-4 rounded-r-md transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[--color-border] text-center text-sm text-[--color-text-muted]">
          <p>&copy; {currentYear} {BUSINESS_INFO.name}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;