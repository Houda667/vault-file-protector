
import React from 'react';
import FileDropZone from '@/components/FileDropZone';
import FileList, { FileItem } from '@/components/FileList';
import EncryptionProgress from '@/components/EncryptionProgress';

interface EncryptTabContentProps {
  files: FileItem[];
  onRemove: (id: string) => void;
  isProcessing: boolean;
  progress: number;
  onFileSelect: (files: File[]) => void;
}

const EncryptTabContent: React.FC<EncryptTabContentProps> = ({
  files,
  onRemove,
  isProcessing,
  progress,
  onFileSelect,
}) => {
  return (
    <div className="space-y-6 mt-0">
      <FileDropZone onFileSelect={onFileSelect} mode="encrypt" />
      {files.length > 0 && <FileList files={files} onRemove={onRemove} mode="encrypt" />}
      <EncryptionProgress isProcessing={isProcessing} progress={progress} mode="encrypt" />
    </div>
  );
};

export default EncryptTabContent;
