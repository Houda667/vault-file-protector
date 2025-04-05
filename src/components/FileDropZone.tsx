
import React, { useState, useCallback } from 'react';
import { Upload, File as FileIcon, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropZoneProps {
  onFileSelect: (files: File[]) => void;
  mode: 'encrypt' | 'decrypt';
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileSelect, mode }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const filesArray = Array.from(e.dataTransfer.files);
        onFileSelect(filesArray);
      }
    },
    [onFileSelect]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const filesArray = Array.from(e.target.files);
        onFileSelect(filesArray);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 transition-all cursor-pointer bg-white shadow-soft hover:shadow-card",
        isDragActive ? "border-vault-accent bg-vault-secondary/10" : "border-vault-secondary",
        mode === 'encrypt' ? "hover:border-blue-400" : "hover:border-green-400"
      )}
    >
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="w-full h-full cursor-pointer">
        <div className="flex flex-col items-center">
          <div className={cn(
            "p-4 mb-5 rounded-full shadow-soft text-white animate-float",
            mode === 'encrypt' ? "bg-gradient-vault" : "bg-gradient-to-br from-green-400 to-emerald-600"
          )}>
            {mode === 'encrypt' ? (
              <Shield size={30} />
            ) : (
              <FileIcon size={30} />
            )}
          </div>
          <p className="mb-2 text-lg font-medium text-vault-text">
            {isDragActive
              ? "Drop files here"
              : mode === 'encrypt'
                ? "Drag files to encrypt"
                : "Drag encrypted files to decrypt"
            }
          </p>
          <p className="text-sm text-vault-text-muted flex items-center">
            or <span className={cn(
              "mx-2 px-3 py-1 rounded-full font-medium",
              mode === 'encrypt' ? "text-blue-600 bg-blue-50" : "text-green-600 bg-green-50"
            )}>browse</span> to select files
          </p>
        </div>
      </label>
    </div>
  );
};

export default FileDropZone;
