
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PasswordInput from '@/components/PasswordInput';

interface EncryptionControlsProps {
  mode: 'encrypt' | 'decrypt';
  onPasswordChange: (password: string) => void;
  onProcess: () => void;
  isProcessing: boolean;
  hasFiles: boolean;
  password: string;
}

const EncryptionControls: React.FC<EncryptionControlsProps> = ({
  mode,
  onPasswordChange,
  onProcess,
  isProcessing,
  hasFiles,
  password,
}) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          {mode === 'encrypt' 
            ? <ShieldCheck className="mr-2 h-4 w-4 text-blue-600" /> 
            : <FileQuestion className="mr-2 h-4 w-4 text-green-600" />
          }
          {mode === 'encrypt' ? 'Paramètres de chiffrement' : 'Paramètres de déchiffrement'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <PasswordInput onChange={onPasswordChange} mode={mode} />
        <Button 
          onClick={onProcess}
          disabled={!hasFiles || !password || isProcessing}
          className={`w-full mt-6 ${mode === 'encrypt' 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-green-600 hover:bg-green-700'
          } transition-colors`}
        >
          {mode === 'encrypt' ? 'Chiffrer les fichiers' : 'Déchiffrer les fichiers'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EncryptionControls;
