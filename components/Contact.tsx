import React from 'react';
import { BUSINESS_INFO } from '../constants';
import { MapPinIcon } from './icons/MapPinIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import AnimateOnScroll from './AnimateOnScroll';

const Contact: React.FC = () => {
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.phone.replace(/\D/g, '')}?text=${encodeURIComponent(BUSINESS_INFO.whatsappMessage)}`;

  return (
    <section id="contact" className="py-24 bg-[--color-bg]">
      <div className="container mx-auto px-6 text-center">
        <AnimateOnScroll className="fade-in-up">
          <h2 className="text-4xl font-bold mb-4 text-[--color-text] tracking-tight">Get In Touch</h2>
          <p className="text-[--color-text-muted] mb-10 max-w-2xl mx-auto">
            Have questions or want to place a bulk order? Reach out to us! We're active on our social channels.
          </p>
          <div className="max-w-md mx-auto bg-[--color-bg] rounded-lg shadow-lg p-8 border border-[--color-border]">
              <div className="flex items-center justify-center mb-6">
                  <MapPinIcon />
                  <p className="ml-3 text-lg text-[--color-text-muted]">{BUSINESS_INFO.address}</p>
              </div>
               <div className="flex items-center justify-center mb-8">
                  <PhoneIcon />
                  <a href={`tel:${BUSINESS_INFO.phone}`} className="ml-3 text-lg text-[--color-primary] hover:text-[--color-primary-hover] hover:underline">{BUSINESS_INFO.phone}</a>
              </div>
              <div className="flex justify-center space-x-6">
                  <a href="https://www.facebook.com/share/1BkAG3Qvm8/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-[--color-primary] transition-colors">
                      <FacebookIcon />
                  </a>
                  <a href="https://www.instagram.com/covercart_in?igsh=MW95ODFnNDFqaTdibw==" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-[--color-primary] transition-colors">
                      <InstagramIcon />
                  </a>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-[--color-primary] transition-colors">
                      <WhatsAppIcon />
                  </a>
              </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default Contact;