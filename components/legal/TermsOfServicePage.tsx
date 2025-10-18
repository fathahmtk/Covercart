import React from 'react';

interface LegalPageProps {
  onBack: () => void;
}

const TermsOfServicePage: React.FC<LegalPageProps> = ({ onBack }) => {
  return (
    <div className="animate-fade-in bg-[--color-bg-subtle]">
      <div className="container mx-auto px-6 py-12">
        <a href="#/" onClick={(e) => { e.preventDefault(); onBack(); }} className="mb-8 inline-block text-[--color-primary] hover:text-[--color-primary-hover] hover:underline">
          &larr; Back to Home
        </a>
        <div className="bg-[--color-bg] p-8 rounded-lg shadow-md border border-[--color-border]">
          <h1 className="text-3xl font-bold mb-6 text-[--color-text]">Terms of Service</h1>
          <div className="space-y-4 text-[--color-text-muted] leading-relaxed">
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-semibold text-[--color-text] pt-4">1. Agreement to Terms</h2>
            <p>By accessing our website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.</p>
            
            <h2 className="text-xl font-semibold text-[--color-text] pt-4">2. AI Generated Content</h2>
            <p>Our AI Designer tool allows you to generate images for phone cases. You are responsible for the prompts you provide. You agree not to generate content that is illegal, obscene, threatening, defamatory, or otherwise injurious to third parties.</p>
            
            <h2 className="text-xl font-semibold text-[--color-text] pt-4">3. Purchases</h2>
            <p>All purchases and transactions are finalized through third-party platforms such as WhatsApp. We are not responsible for any issues that arise from the use of these third-party services. All payments are subject to their terms and conditions.</p>
            
            <h2 className="text-xl font-semibold text-[--color-text] pt-4">4. Limitation of Liability</h2>
            <p>In no event shall CoverCart, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

            <h2 className="text-xl font-semibold text-[--color-text] pt-4">5. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;