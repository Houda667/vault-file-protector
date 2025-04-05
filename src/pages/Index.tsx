import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Lock, Unlock, Clock, X } from 'lucide-react';
import Header from '@/components/Header';
import FileDropZone from '@/components/FileDropZone';
import PasswordInput from '@/components/PasswordInput';
import EncryptionProgress from '@/components/EncryptionProgress';
import FileList, { FileItem } from '@/components/FileList';
import { encryptFile, decryptFile } from '@/lib/encryptionService';
import { saveFile, generateId, saveToRecentFiles, getRecentFiles } from '@/lib/fileService';

const Index = () => {
  const [activeTab, setActiveTab] = useState('encrypt');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recentFiles, setRecentFiles] = useState<Array<{ id: string; name: string; date: number; mode: string }>>([]);

  useEffect(() => {
    setRecentFiles(getRecentFiles());
  }, []);

  const resetState = useCallback(() => {
    setFiles([]);
    setPassword('');
    setProgress(0);
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    resetState();
  }, [resetState]);

  const handleFileSelect = useCallback((selectedFiles: File[]) => {
    const newFiles = selectedFiles.map(file => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending' as const,
      file: file
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  const handlePasswordChange = useCallback((newPassword: string) => {
    setPassword(newPassword);
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const processFiles = useCallback(async () => {
    if (!files.length || !password || isProcessing) return;
    
    setIsProcessing(true);
    const mode = activeTab as 'encrypt' | 'decrypt';

    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i];
      const file = fileItem.file as File;
      
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'processing' as const } : f
      ));

      try {
        const result = mode === 'encrypt' 
          ? await encryptFile(file, password, setProgress)
          : await decryptFile(file, password, setProgress);
        
        if (result.success && result.data) {
          await saveFile(result, file, mode);
          
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { ...f, status: 'completed' as const } : f
          ));
          
          saveToRecentFiles({
            id: generateId(),
            name: file.name,
            date: Date.now(),
            mode
          });
          
          setRecentFiles(getRecentFiles());
          
          toast({
            title: `File ${mode}ed successfully`,
            description: `"${file.name}" has been ${mode}ed and saved.`,
          });
        } else {
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { 
              ...f, 
              status: 'error' as const, 
              error: result.error || `Failed to ${mode} file` 
            } : f
          ));
          
          toast({
            variant: "destructive",
            title: `Failed to ${mode} file`,
            description: result.error || "An unknown error occurred",
          });
        }
      } catch (error) {
        console.error(`Error ${mode}ing file:`, error);
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { 
            ...f, 
            status: 'error' as const, 
            error: error instanceof Error ? error.message : `Failed to ${mode} file` 
          } : f
        ));
        
        toast({
          variant: "destructive",
          title: `Error ${mode}ing file`,
          description: error instanceof Error ? error.message : "An unknown error occurred",
        });
      }
    }
    
    setIsProcessing(false);
    setProgress(0);
  }, [files, password, isProcessing, activeTab]);

  const clearRecentFiles = useCallback(() => {
    localStorage.removeItem('vaultRecentFiles');
    setRecentFiles([]);
    toast({
      title: "History cleared",
      description: "Your recent files history has been cleared.",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-vault-bg text-vault-text">
      <Header />
      
      <div className="flex-1 container max-w-4xl mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 bg-vault-card/40 mb-6">
            <TabsTrigger value="encrypt" className="data-[state=active]:bg-gradient-vault data-[state=active]:text-white">
              <Lock className="mr-2 h-4 w-4" />
              Encrypt Files
            </TabsTrigger>
            <TabsTrigger value="decrypt" className="data-[state=active]:bg-gradient-vault data-[state=active]:text-white">
              <Unlock className="mr-2 h-4 w-4" />
              Decrypt Files
            </TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3 space-y-6">
              <TabsContent value="encrypt" className="space-y-6 mt-0">
                <FileDropZone onFileSelect={handleFileSelect} mode="encrypt" />
                {files.length > 0 && <FileList files={files} onRemove={handleRemoveFile} mode="encrypt" />}
                <EncryptionProgress isProcessing={isProcessing} progress={progress} mode="encrypt" />
              </TabsContent>
              
              <TabsContent value="decrypt" className="space-y-6 mt-0">
                <FileDropZone onFileSelect={handleFileSelect} mode="decrypt" />
                {files.length > 0 && <FileList files={files} onRemove={handleRemoveFile} mode="decrypt" />}
                <EncryptionProgress isProcessing={isProcessing} progress={progress} mode="decrypt" />
              </TabsContent>
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <div className="bg-vault-card/30 border border-vault-card rounded-lg p-4">
                <PasswordInput 
                  onChange={handlePasswordChange} 
                  mode={activeTab as 'encrypt' | 'decrypt'} 
                />
                
                <Button 
                  onClick={processFiles}
                  disabled={!files.length || !password || isProcessing}
                  className="w-full mt-6 bg-gradient-vault hover:opacity-90 transition-opacity"
                >
                  {activeTab === 'encrypt' ? (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Encrypt Files
                    </>
                  ) : (
                    <>
                      <Unlock className="mr-2 h-4 w-4" />
                      Decrypt Files
                    </>
                  )}
                </Button>
              </div>
              
              {recentFiles.length > 0 && (
                <div className="bg-vault-card/30 border border-vault-card rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-vault-text-muted" />
                      Recent Files
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearRecentFiles}
                      className="h-8 px-2 text-xs text-vault-text-muted hover:text-vault-danger"
                    >
                      <X className="mr-1 h-3 w-3" />
                      Clear
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {recentFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 text-sm bg-vault-card/50 rounded">
                        <div className="flex items-center overflow-hidden">
                          {file.mode === 'encrypt' ? (
                            <Lock className="mr-2 h-3 w-3 text-vault-accent" />
                          ) : (
                            <Unlock className="mr-2 h-3 w-3 text-vault-success" />
                          )}
                          <span className="truncate max-w-[120px]">{file.name}</span>
                        </div>
                        <span className="text-xs text-vault-text-muted">
                          {formatDate(file.date)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
