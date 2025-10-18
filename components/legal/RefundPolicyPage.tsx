import React from 'react';

interface LegalPageProps {
  onBack: () => void;
}

const RefundPolicyPage: React.FC<LegalPageProps> = ({ onBack }) => {
  return (
    <div className="animate-fade-in bg-[--color-bg-subtle]">
      <div className="container mx-auto px-6 py-12">
        <a href="#/" onClick={(e) => { e.preventDefault(); onBack(); }} className="mb-8 inline-block text-[--color-primary] hover:text-[--color-primary-hover] hover:underline">
          &larr; Back to Home
        </a>
        <div className="bg-[--color-bg] p-8 rounded-lg shadow-md border border-[--color-border]">
          <h1 className="text-3xl font-bold mb-6 text-[--color-text]">Refund Policy</h1>
          <div className="space-y-4 text-[--color-text-muted] leading-relaxed">
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-semibold text-[--color-text] pt-4">1. General Policy</h2>
            <p>We want you to be happy with your purchase. If you are not completely satisfied, you may be eligible for a return or exchange subject to the terms and conditions below.</p>
            
            <h2 className="text-xl font-semibold text-[--color-text] pt-4">2. Eligibility for Returns</h2>
            <p>To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging. Returns must be initiated within 7 days of receiving your product.</p>
            
            <h2 className="text-xl font-semibold text-[--color-text] pt-4">3. Non-Returnable Items</h2>
            <p>Custom-designed products, including those created with our AI Designer tool, are non-returnable and non-refundable, unless the product arrives with a manufacturing defect.</p>
            
            <h2 className="text-xl font-semibold text-[--color-text] pt-4">4. Process</h2>
            <p>To initiate a return, please contact us via WhatsApp or our provided contact details with your order information and a reason for the return. We will guide you through the process. Return shipping costs are the responsibility of the customer unless the item is defective.</p>

            <h2 className="text-xl font-semibold text-[--color-text] pt-4">5. Refunds</h2>
            <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will be applied via the original method of payment or another agreed-upon method.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;