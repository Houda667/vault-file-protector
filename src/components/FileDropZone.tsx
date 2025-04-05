
import React, { useState, useCallback } from 'react';
import { Upload, File as FileIcon, Shield, PlusCircle, ImageIcon, FileText, FileCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  const getIconBasedOnMode = () => {
    if (mode === 'encrypt') {
      return <Shield size={30} />;
    } else {
      return <FileCog size={30} />;
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 transition-all cursor-pointer bg-white",
        isDragActive 
          ? "shadow-lg border-blue-500 bg-blue-50" 
          : "shadow-md border-gray-200 hover:border-blue-400 hover:shadow-lg",
        mode === 'encrypt' 
          ? "hover:bg-blue-50" 
          : "hover:bg-green-50"
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
            "p-4 mb-5 rounded-full shadow-lg text-white animate-float",
            mode === 'encrypt' 
              ? "bg-gradient-to-br from-blue-500 to-indigo-600" 
              : "bg-gradient-to-br from-green-400 to-emerald-600"
          )}>
            {getIconBasedOnMode()}
          </div>
          
          <div className="text-center">
            <p className="mb-3 text-xl font-semibold text-gray-800">
              {isDragActive
                ? "Déposez les fichiers ici"
                : mode === 'encrypt'
                  ? "Glissez-déposez les fichiers à chiffrer"
                  : "Glissez-déposez les fichiers à déchiffrer"
              }
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-500">
                <FileText size={16} />
                <span>Documents</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <ImageIcon size={16} />
                <span>Images</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <FileIcon size={16} />
                <span>Autres</span>
              </div>
            </div>
            
            <div className="mt-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      className={cn(
                        "rounded-full mt-2",
                        mode === 'encrypt' 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "bg-green-600 hover:bg-green-700"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('file-upload')?.click();
                      }}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Sélectionner des fichiers
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cliquez pour parcourir vos fichiers</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default FileDropZone;
