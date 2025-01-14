import React, { useState } from 'react';
import { Upload, X, FileText, Check } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'uploading' | 'complete' | 'error';
}

export function DocumentUpload() {
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newDocuments = files.map((file) => ({
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      status: 'complete' as const,
    }));
    setDocuments([...documents, ...newDocuments]);
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Documentos Comprobatórios</h2>
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-blue-900">
                  Clique para upload
                </span>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                PDF, JPG ou PNG até 10MB
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-900">{doc.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {doc.status === 'complete' && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}