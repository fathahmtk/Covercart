import React from 'react';
import AiDesigner from './AiDesigner';

interface AiDesignerPageProps {
  onBack: () => void;
}

const AiDesignerPage: React.FC<AiDesignerPageProps> = ({ onBack }) => {
  return (
    <div className="animate-fade-in bg-[--color-bg-secondary]">
      <div className="container mx-auto px-6 pt-12">
        <a href="#/" onClick={(e) => { e.preventDefault(); onBack(); }} className="mb-8 inline-block text-[--color-primary] hover:text-[--color-primary-hover] hover:underline">
          &larr; Back to Home
        </a>
      </div>
      <AiDesigner />
    </div>
  );
};

export default AiDesignerPage;
