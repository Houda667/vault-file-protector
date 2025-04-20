
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, Lock, FileCheck } from 'lucide-react';

interface RecentFile {
  id: string;
  name: string;
  date: number;
  mode: string;
}

interface RecentFilesProps {
  recentFiles: RecentFile[];
  onClear: () => void;
  formatDate: (timestamp: number) => string;
}

const RecentFiles: React.FC<RecentFilesProps> = ({ recentFiles, onClear, formatDate }) => {
  if (recentFiles.length === 0) return null;

  return (
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
            onClick={onClear}
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
  );
};

export default RecentFiles;
