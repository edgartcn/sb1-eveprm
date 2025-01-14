import React, { useState } from 'react';
import { ArrowLeft, Save, Download, FileText, Wand2 } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useClient } from '../contexts/ClientContext';
import { EditorToolbar } from '../components/petition/EditorToolbar';
import { RichTextEditor } from '../components/petition/RichTextEditor';
import { DocumentPreview } from '../components/petition/DocumentPreview';
import { GeneratePetitionDialog } from '../components/petition/GeneratePetitionDialog';
import { ClientHeader } from '../components/ClientHeader';
import { ClientSelector } from '../components/ClientSelector';

export function PetitionEditor() {
  const { goToDashboard } = useNavigate();
  const { selectedClient } = useClient();
  const [content, setContent] = useState('');
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  const handleGeneratedContent = (generatedContent: string) => {
    setContent(generatedContent);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ClientHeader
        title="Editor de Petições"
        subtitle="Crie e edite petições previdenciárias"
        onBack={goToDashboard}
        actions={
          selectedClient && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsGenerateDialogOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-800 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Gerar com IA
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-800 rounded-md hover:bg-blue-700 transition-colors">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-800 rounded-md hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
            </div>
          )
        }
      />

      {!selectedClient ? (
        <main className="flex-1 p-8">
          <ClientSelector />
        </main>
      ) : (
        <>
          <EditorToolbar />
          <main className="flex-1 flex">
            <div className="flex-1 flex">
              <div className="w-1/2 border-r border-gray-200 bg-white">
                <RichTextEditor content={content} onUpdate={setContent} />
              </div>
              <div className="w-1/2 bg-gray-50">
                <DocumentPreview content={content} />
              </div>
            </div>
          </main>
        </>
      )}

      <GeneratePetitionDialog
        isOpen={isGenerateDialogOpen}
        onClose={() => setIsGenerateDialogOpen(false)}
        onGenerate={handleGeneratedContent}
      />
    </div>
  );
}