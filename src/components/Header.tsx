
import React from 'react';
import { Shield, Lock } from 'lucide-react';

const Header = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-vault-card/40 border-b border-vault-card">
      <div className="flex items-center space-x-3">
        <div className="rounded-full bg-gradient-vault p-2 text-white">
          <Shield size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-vault-text flex items-center">
            Vault <span className="text-vault-accent mx-1">File</span> Protector
            <Lock className="ml-2" size={16} />
          </h1>
          <p className="text-vault-text-muted text-sm">Secure file encryption made simple</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
