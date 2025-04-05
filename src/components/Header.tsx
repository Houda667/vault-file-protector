
import React from 'react';
import { Shield, Lock, Info, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Header = () => {
  return (
    <div className="bg-white shadow-md border-b border-gray-100">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 text-white shadow-lg transform transition-all hover:scale-105">
              <Shield size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                Vault <span className="text-blue-600 mx-1.5">File</span> Protector
                <Lock className="ml-2 text-blue-600" size={18} />
              </h1>
              <p className="text-gray-600 text-sm mt-0.5">Sécurisation et chiffrement de fichiers simple et efficace</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden md:flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                    <span className="text-sm text-gray-600">Connexion sécurisée</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Votre connexion est cryptée et sécurisée</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
                    <Info size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Aide et information</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
                    <Settings size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Paramètres</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
