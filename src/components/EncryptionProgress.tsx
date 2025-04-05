
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface EncryptionProgressProps {
  isProcessing: boolean;
  progress: number;
  mode: 'encrypt' | 'decrypt';
}

const EncryptionProgress: React.FC<EncryptionProgressProps> = ({
  isProcessing,
  progress,
  mode
}) => {
  if (!isProcessing) return null;

  return (
    <div className="w-full p-4 bg-vault-card/50 rounded-lg border border-vault-card">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span className="text-sm font-medium text-vault-text">
            {mode === 'encrypt' ? 'Encrypting' : 'Decrypting'} files...
          </span>
        </div>
        <span className="text-sm font-medium text-vault-text-muted">
          {Math.round(progress)}%
        </span>
      </div>
      <Progress value={progress} className="h-2 bg-vault-card">
        <div 
          className="h-full bg-gradient-vault rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }} 
        />
      </Progress>
    </div>
  );
};

export default EncryptionProgress;
