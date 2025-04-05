
import { EncryptionResult } from './encryptionService';

export const saveFile = async (result: EncryptionResult, originalFile: File, mode: 'encrypt' | 'decrypt'): Promise<void> => {
  if (!result.success || !result.data) {
    console.error('Cannot save file: invalid result');
    return;
  }

  // Create a file name for the saved file
  let fileName = originalFile.name;
  if (mode === 'encrypt') {
    fileName = `${fileName}.vault`;
  } else {
    // For decryption, remove .vault extension if present
    fileName = fileName.endsWith('.vault') 
      ? fileName.slice(0, -6) 
      : `decrypted_${fileName}`;
  }

  // Create a download link and trigger it
  const url = URL.createObjectURL(result.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

// Helper to generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Store recently processed files in localStorage
export const saveToRecentFiles = (fileInfo: { 
  id: string; 
  name: string; 
  date: number;
  mode: 'encrypt' | 'decrypt';
}): void => {
  try {
    const recentFiles = getRecentFiles();
    
    // Add new file to the beginning, limit to 10 files
    const updatedFiles = [fileInfo, ...recentFiles].slice(0, 10);
    
    localStorage.setItem('vaultRecentFiles', JSON.stringify(updatedFiles));
  } catch (error) {
    console.error('Failed to save recent files:', error);
  }
};

// Get recent files from localStorage
export const getRecentFiles = (): Array<{ 
  id: string; 
  name: string; 
  date: number;
  mode: 'encrypt' | 'decrypt';
}> => {
  try {
    const savedFiles = localStorage.getItem('vaultRecentFiles');
    return savedFiles ? JSON.parse(savedFiles) : [];
  } catch (error) {
    console.error('Failed to retrieve recent files:', error);
    return [];
  }
};
