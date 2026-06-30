import React from 'react';
import { Fact } from '@/types/fact';

interface FactModalProps {
  fact: Fact;
  onAcknowledge: () => void;
}

export const FactModal: React.FC<FactModalProps> = ({ fact, onAcknowledge }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-center text-white">
          <div className="text-4xl mb-2">📜</div>
          <h2 className="text-2xl font-bold font-heading">Petunjuk Sejarah</h2>
          <p className="text-blue-100 mt-1">Fakta penting yang mungkin berguna!</p>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-3">{fact.title}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{fact.description}</p>
          
          <button
            onClick={onAcknowledge}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
