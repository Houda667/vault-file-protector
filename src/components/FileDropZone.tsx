import React, { useState, useCallback } from 'react';
import { Upload, Shield, PlusCircle, ImageIcon, FileText, FileCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
        "relative overflow-hidden rounded-2xl transition-all duration-300",
        "bg-gradient-to-br from-white to-purple-50 p-8",
        "border-2 border-dashed group",
        isDragActive 
          ? "border-purple-400 bg-purple-50 shadow-lg scale-102" 
          : "border-gray-200 hover:border-purple-300",
        mode === 'encrypt' 
          ? "hover:bg-purple-50/50" 
          : "hover:bg-blue-50/50"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />
      
      <label htmlFor="file-upload" className="w-full h-full cursor-pointer relative z-10">
        <div className="flex flex-col items-center space-y-6">
          <div className={cn(
            "p-6 rounded-full shadow-lg text-white transform transition-all duration-500 group-hover:scale-110",
            mode === 'encrypt' 
              ? "bg-gradient-to-br from-purple-500 to-indigo-600" 
              : "bg-gradient-to-br from-blue-500 to-cyan-600"
          )}>
            {mode === 'encrypt' ? <Shield size={40} /> : <FileCog size={40} />}
          </div>
          
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              {isDragActive
                ? "Déposez les fichiers ici"
                : mode === 'encrypt'
                  ? "Chiffrer un fichier"
                  : "Déchiffrer un fichier"
              }
            </h3>
            
            <p className="text-gray-600">
              {mode === 'encrypt' 
                ? "Protégez vos fichiers confidentiels avec un mot de passe fort" 
                : "Sélectionnez un fichier à déchiffrer"}
            </p>
            
            <div className="flex items-center justify-center gap-6 text-gray-500">
              <div className="flex items-center gap-2 text-sm">
                <FileText size={18} />
                <span>Documents</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ImageIcon size={18} />
                <span>Images</span>
              </div>
            </div>
            
            <Button 
              className={cn(
                "mt-4 transform transition-all duration-300 hover:scale-105",
                mode === 'encrypt' 
                  ? "bg-purple-600 hover:bg-purple-700" 
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Sélectionner des fichiers
            </Button>
          </div>
        </div>
      </label>
    </div>
  );
};

export default FileDropZone;
