import React, { useCallback } from 'react';
import { Upload, FileText, Loader } from 'lucide-react';
import { useClient } from '../../contexts/ClientContext';
import { parseCnisPdf } from '../../services/cnis/pdfParser';
import { saveCnisAnalysis } from '../../services/cnis/analysis';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

export function FileUploader({ onFileUpload }: FileUploaderProps) {
  const { selectedClient } = useClient();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFileProcessing = async (file: File) => {
    if (!selectedClient) {
      setError('Selecione um cliente primeiro');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Processa o PDF
      const cnisData = await parseCnisPdf(file);
      
      if (!cnisData || !cnisData.contributions.length) {
        throw new Error('Não foi possível extrair dados do CNIS');
      }

      // Adiciona o ID do cliente aos dados
      const dataWithClientId = {
        ...cnisData,
        clientId: selectedClient.id
      };

      // Salva os dados no banco
      await saveCnisAnalysis(selectedClient.id, dataWithClientId);

      onFileUpload(file);
    } catch (err) {
      console.error('Erro ao processar CNIS:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar o arquivo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        handleFileProcessing(file);
      } else {
        setError('Por favor, envie um arquivo PDF');
      }
    },
    [selectedClient]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        handleFileProcessing(file);
      } else {
        setError('Por favor, envie um arquivo PDF');
      }
    }
  };

  if (!selectedClient) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Selecione um cliente</h3>
          <p className="mt-1 text-sm text-gray-500">
            É necessário selecionar um cliente antes de fazer upload do CNIS
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="bg-white rounded-lg shadow-md p-8"
    >
      <div className="text-center">
        {isProcessing ? (
          <>
            <Loader className="mx-auto h-12 w-12 text-blue-900 animate-spin" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Processando CNIS</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aguarde enquanto processamos o arquivo...
            </p>
          </>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-900">Upload do CNIS</h2>
              <p className="mt-1 text-gray-500">Arraste e solte o arquivo PDF ou clique para selecionar</p>
            </div>
            <label className="mt-4 cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="application/pdf"
                onChange={handleFileInput}
              />
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800">
                <FileText className="w-4 h-4 mr-2" />
                Selecionar Arquivo
              </span>
            </label>
          </>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}