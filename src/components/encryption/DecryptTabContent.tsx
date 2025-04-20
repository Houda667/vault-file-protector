
import React from 'react';
import FileDropZone from '@/components/FileDropZone';
import FileList, { FileItem } from '@/components/FileList';
import EncryptionProgress from '@/components/EncryptionProgress';

interface DecryptTabContentProps {
  files: FileItem[];
  onRemove: (id: string) => void;
  isProcessing: boolean;
  progress: number;
}

const DecryptTabContent: React.FC<DecryptTabContentProps> = ({
  files,
  onRemove,
  isProcessing,
  progress,
}) => {
  return (
    <div className="space-y-6 mt-0">
      <FileDropZone onFileSelect={handleFileSelect} mode="decrypt" />
      {files.length > 0 && <FileList files={files} onRemove={onRemove} mode="decrypt" />}
      <EncryptionProgress isProcessing={isProcessing} progress={progress} mode="decrypt" />
    </div>
  );
};

export default DecryptTabContent;
