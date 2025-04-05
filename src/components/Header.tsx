
import React from 'react';
import { Shield, Lock } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-white shadow-md border-b border-gray-100">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-vault rounded-xl p-2.5 text-white shadow-lg transform transition-all hover:scale-105">
              <Shield size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-vault-text flex items-center">
                Vault <span className="text-vault-accent mx-1.5">File</span> Protector
                <Lock className="ml-2 text-vault-accent" size={18} />
              </h1>
              <p className="text-vault-text-muted text-sm mt-0.5">Secure file encryption made simple</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <div className="bg-vault-bg rounded-full px-4 py-1 text-sm text-vault-text-muted border border-vault-secondary flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
              Secure connection
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
