
import React, { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Unlock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import Header from '@/components/Header';
import { FileItem } from '@/components/FileList';
import { encryptFile, decryptFile } from '@/lib/encryptionService';
import { saveFile, generateId, saveToRecentFiles, getRecentFiles } from '@/lib/fileService';
import EncryptTabContent from '@/components/encryption/EncryptTabContent';
import DecryptTabContent from '@/components/encryption/DecryptTabContent';
import EncryptionControls from '@/components/encryption/EncryptionControls';
import RecentFiles from '@/components/encryption/RecentFiles';

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
    
    toast({
      title: `${selectedFiles.length} fichier(s) ajouté(s)`,
      description: "Les fichiers ont été ajoutés avec succès.",
    });
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    
    toast({
      title: "Fichier supprimé",
      description: "Le fichier a été retiré de la liste.",
    });
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
            title: `Fichier ${mode === 'encrypt' ? 'chiffré' : 'déchiffré'} avec succès`,
            description: `"${file.name}" a été ${mode === 'encrypt' ? 'chiffré' : 'déchiffré'} et sauvegardé.`,
          });
        } else {
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { 
              ...f, 
              status: 'error' as const, 
              error: result.error || `Échec du ${mode === 'encrypt' ? 'chiffrement' : 'déchiffrement'} du fichier` 
            } : f
          ));
          
          toast({
            variant: "destructive",
            title: `Échec du ${mode === 'encrypt' ? 'chiffrement' : 'déchiffrement'} du fichier`,
            description: result.error || "Une erreur inconnue s'est produite",
          });
        }
      } catch (error) {
        console.error(`Erreur lors du ${mode === 'encrypt' ? 'chiffrement' : 'déchiffrement'} du fichier:`, error);
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { 
            ...f, 
            status: 'error' as const, 
            error: error instanceof Error ? error.message : `Échec du ${mode === 'encrypt' ? 'chiffrement' : 'déchiffrement'} du fichier` 
          } : f
        ));
        
        toast({
          variant: "destructive",
          title: `Erreur lors du ${mode === 'encrypt' ? 'chiffrement' : 'déchiffrement'} du fichier`,
          description: error instanceof Error ? error.message : "Une erreur inconnue s'est produite",
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
      title: "Historique effacé",
      description: "L'historique de vos fichiers récents a été effacé.",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />
      
      <div className="flex-1 container max-w-5xl mx-auto py-10 px-4">
        <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b pb-8">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-gray-800">
                  {activeTab === 'encrypt' ? 'Chiffrer vos fichiers' : 'Déchiffrer vos fichiers'}
                </CardTitle>
                <CardDescription className="mt-2 text-gray-600">
                  {activeTab === 'encrypt' 
                    ? "Protégez vos données sensibles en quelques clics" 
                    : "Accédez à vos fichiers protégés en toute sécurité"}
                </CardDescription>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mt-6">
              <TabsList className="grid grid-cols-2 bg-blue-100/50 w-full max-w-md mx-auto">
                <TabsTrigger 
                  value="encrypt" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Chiffrer
                </TabsTrigger>
                <TabsTrigger 
                  value="decrypt" 
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  <Unlock className="mr-2 h-4 w-4" />
                  Déchiffrer
                </TabsTrigger>
              </TabsList>
            
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                  <div className="md:col-span-3 space-y-6">
                    <TabsContent value="encrypt">
                      <EncryptTabContent
                        files={files}
                        onRemove={handleRemoveFile}
                        isProcessing={isProcessing}
                        progress={progress}
                        onFileSelect={handleFileSelect}
                      />
                    </TabsContent>
                    
                    <TabsContent value="decrypt">
                      <DecryptTabContent
                        files={files}
                        onRemove={handleRemoveFile}
                        isProcessing={isProcessing}
                        progress={progress}
                        onFileSelect={handleFileSelect}
                      />
                    </TabsContent>
                  </div>
                  
                  <div className="md:col-span-2 space-y-6">
                    <EncryptionControls
                      mode={activeTab as 'encrypt' | 'decrypt'}
                      onPasswordChange={handlePasswordChange}
                      onProcess={processFiles}
                      isProcessing={isProcessing}
                      hasFiles={files.length > 0}
                      password={password}
                    />
                    
                    <RecentFiles
                      recentFiles={recentFiles}
                      onClear={clearRecentFiles}
                      formatDate={formatDate}
                    />
                  </div>
                </div>
              </div>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Index;
