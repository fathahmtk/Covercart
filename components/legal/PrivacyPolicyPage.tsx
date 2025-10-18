import React from 'react';

interface LegalPageProps {
  onBack: () => void;
}

const PrivacyPolicyPage: React.FC<LegalPageProps> = ({ onBack }) => {
  return (
    <div className="animate-fade-in bg-[--color-bg-subtle]">
      <div className="container mx-auto px-6 py-12">
        <a href="#/" onClick={(e) => { e.preventDefault(); onBack(); }} className="mb-8 inline-block text-[--color-primary] hover:text-[--color-primary-hover] hover:underline">
          &larr; Back to Home
        </a>
        <div className="bg-[--color-bg] p-8 rounded-lg shadow-md border border-[--color-border]">
          <h1 className="text-3xl font-bold mb-6 text-[--color-text]">Privacy Policy</h1>
          <div className="space-y-4 text-[--color-text-muted] leading-relaxed">
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-semibold text-[--color-text] pt-4">1. Introduction</h2>
            <p>Welcome to CoverCart. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
            
            <h2 className="text-xl font-semibold text-[--color-text] pt-4">2. Information We Collect</h2>
            <p>We may collect personal information from you such as your name, email address, and phone number when you place an order or contact us. This application stores cart, wishlist, and product data in your browser's local storage. This data is not transmitted to our servers and remains on your device.</p>
            
            <h2 className="text-xl font-semibold text-[--color-text] pt-4">3. Use of Your Information</h2>
            <p>We use the information we collect to process your transactions via WhatsApp and to communicate with you about your orders. We do not sell or share your personal information with third parties for marketing purposes.</p>
            
            <h2 className="text-xl font-semibold text-[--color-text] pt-4">4. Security of Your Information</h2>
            <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>

            <h2 className="text-xl font-semibold text-[--color-text] pt-4">5. Contact Us</h2>
            <p>If you have questions or comments about this Privacy Policy, please contact us using the details provided on our contact page.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;