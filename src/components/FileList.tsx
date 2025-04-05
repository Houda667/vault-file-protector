
import React from 'react';
import { File, X, Lock, Unlock, Check, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';

export type FileStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  error?: string;
  file?: File; // Added this property to store the original File object
}

interface FileListProps {
  files: FileItem[];
  onRemove: (id: string) => void;
  mode: 'encrypt' | 'decrypt';
}

const FileList: React.FC<FileListProps> = ({ files, onRemove, mode }) => {
  if (!files.length) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <File className="text-blue-500" />;
    } else if (fileType.startsWith('video/')) {
      return <File className="text-purple-500" />;
    } else if (fileType.startsWith('audio/')) {
      return <File className="text-green-500" />;
    } else if (fileType.includes('pdf')) {
      return <File className="text-red-500" />;
    } else if (fileType.includes('document') || fileType.includes('sheet') || fileType.includes('presentation')) {
      return <FileText className="text-yellow-500" />;
    } else {
      return <File className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status: FileStatus) => {
    switch (status) {
      case 'processing':
        return <Badge variant="secondary" className="animate-pulse">Traitement...</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-500 text-white">Terminé</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
      default:
        return mode === 'encrypt' 
          ? <Badge variant="outline" className="border-blue-500 text-blue-500">Prêt à chiffrer</Badge> 
          : <Badge variant="outline" className="border-blue-500 text-blue-500">Prêt à déchiffrer</Badge>;
    }
  };

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case 'processing':
        return <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-blue-500 animate-spin" />;
      case 'completed':
        return <Check size={18} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={18} className="text-red-500" />;
      default:
        return mode === 'encrypt' ? <Lock size={18} className="text-blue-500" /> : <Unlock size={18} className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">
          {files.length} fichier{files.length !== 1 ? 's' : ''} sélectionné{files.length !== 1 ? 's' : ''}
        </h3>
      </div>
      
      <div className="overflow-y-auto max-h-[400px] pr-1 space-y-3 custom-scrollbar">
        {files.map((file) => (
          <TooltipProvider key={file.id}>
            <div 
              className={cn(
                "group flex items-center justify-between p-4 rounded-lg bg-white border card-shadow hover:shadow-md transition-all",
                file.status === 'error' 
                  ? "bg-red-50 border-red-200" 
                  : "border-gray-100",
                file.status === 'completed' && "bg-green-50 border-green-100"
              )}
            >
              <div className="flex items-center space-x-4 overflow-hidden flex-1">
                <div className="flex-shrink-0 w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center">
                  {getFileIcon(file.type)}
                </div>
                
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[180px] sm:max-w-xs">
                      {file.name}
                    </p>
                    <div className="ml-2">
                      {getStatusBadge(file.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                  
                  {file.status === 'error' && (
                    <p className="text-xs text-red-500 mt-1">{file.error || 'Erreur lors du traitement du fichier'}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3 ml-2">
                <div className="w-7 h-7 flex items-center justify-center">
                  {getStatusIcon(file.status)}
                </div>
                
                {file.status !== 'processing' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => onRemove(file.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-all"
                        aria-label="Supprimer le fichier"
                      >
                        <X size={18} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Supprimer</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default FileList;
