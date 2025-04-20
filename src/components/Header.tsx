
import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <div className="w-full bg-gradient-to-b from-white to-purple-50 py-16 text-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
              <Shield size={32} className="text-white" />
              <Sparkles className="absolute -top-2 -right-2 text-yellow-300 animate-pulse" size={16} />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Secret File Keeper
          </h1>
          
          <p className="max-w-2xl text-gray-600 text-lg">
            Un outil de chiffrement de fichiers sécurisé qui protège vos données confidentielles avec un chiffrement conforme aux normes de l'industrie. Toutes les opérations sont exécutées dans le cloud de manière sécurisée.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
