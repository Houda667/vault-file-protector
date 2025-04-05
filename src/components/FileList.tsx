
import React from 'react';
import { File, X, Lock, Unlock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case 'processing':
        return <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-vault-accent animate-spin" />;
      case 'completed':
        return <Check size={16} className="text-vault-success" />;
      case 'error':
        return <X size={16} className="text-vault-danger" />;
      default:
        return mode === 'encrypt' ? <Lock size={16} className="text-vault-text-muted" /> : <Unlock size={16} className="text-vault-text-muted" />;
    }
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-vault-text">
          {files.length} file{files.length !== 1 ? 's' : ''} selected
        </h3>
      </div>
      
      <div className="overflow-y-auto max-h-60 pr-1 space-y-2">
        {files.map((file) => (
          <div 
            key={file.id}
            className={cn(
              "group flex items-center justify-between p-3 rounded-md bg-vault-card/40 border border-vault-card hover:bg-vault-card/60 transition-all",
              file.status === 'error' && "bg-vault-danger/10 border-vault-danger/50"
            )}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="flex-shrink-0 w-8 h-8 rounded bg-vault-card/80 flex items-center justify-center">
                <File size={16} className="text-vault-text-muted" />
              </div>
              
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-vault-text truncate max-w-[180px] sm:max-w-xs">
                  {file.name}
                </p>
                <p className="text-xs text-vault-text-muted">
                  {formatFileSize(file.size)}
                </p>
                
                {file.status === 'error' && (
                  <p className="text-xs text-vault-danger mt-1">{file.error || 'Error processing file'}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 flex items-center justify-center">
                {getStatusIcon(file.status)}
              </div>
              
              {file.status !== 'processing' && (
                <button 
                  onClick={() => onRemove(file.id)}
                  className="text-vault-text-muted hover:text-vault-danger p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
