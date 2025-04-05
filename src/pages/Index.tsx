
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Lock, Unlock, Clock, X, Info, Download, ShieldCheck, Settings, FileQuestion, FileCheck, Trash2, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <HelpCircle className="h-5 w-5 text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="w-80">
                    <div className="space-y-2">
                      <p className="font-medium">Comment ça marche ?</p>
                      <p className="text-xs">
                        {activeTab === 'encrypt' 
                          ? "1. Importez vos fichiers à chiffrer\n2. Définissez un mot de passe fort\n3. Cliquez sur Chiffrer pour sécuriser vos données" 
                          : "1. Importez vos fichiers chiffrés\n2. Entrez le mot de passe utilisé pour le chiffrement\n3. Cliquez sur Déchiffrer pour récupérer vos fichiers"}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
            </Tabs>
          </CardHeader>
          
          <CardContent className="p-6">
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
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      {activeTab === 'encrypt' 
                        ? <ShieldCheck className="mr-2 h-4 w-4 text-blue-600" /> 
                        : <FileQuestion className="mr-2 h-4 w-4 text-green-600" />
                      }
                      {activeTab === 'encrypt' ? 'Paramètres de chiffrement' : 'Paramètres de déchiffrement'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <PasswordInput 
                      onChange={handlePasswordChange} 
                      mode={activeTab as 'encrypt' | 'decrypt'} 
                    />
                    
                    <Button 
                      onClick={processFiles}
                      disabled={!files.length || !password || isProcessing}
                      className={`w-full mt-6 ${activeTab === 'encrypt' 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-green-600 hover:bg-green-700'
                      } transition-colors`}
                    >
                      {activeTab === 'encrypt' ? (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Chiffrer les fichiers
                        </>
                      ) : (
                        <>
                          <Unlock className="mr-2 h-4 w-4" />
                          Déchiffrer les fichiers
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
                
                {recentFiles.length > 0 && (
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-gray-600" />
                          Fichiers récents
                        </CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearRecentFiles}
                          className="h-8 px-2 text-xs text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Effacer
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {recentFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                            <div className="flex items-center overflow-hidden">
                              {file.mode === 'encrypt' ? (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mr-2">
                                  <Lock className="mr-1 h-3 w-3" />
                                  Chiffré
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                                  <FileCheck className="mr-1 h-3 w-3" />
                                  Déchiffré
                                </Badge>
                              )}
                              <span className="truncate max-w-[120px]">{file.name}</span>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatDate(file.date)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
