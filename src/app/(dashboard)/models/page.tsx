'use client';

import { useState, useEffect } from 'react';
import { Box, Play, Download } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  version: string;
  metrics: any;
  status: string;
  created_at: string;
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => {
        setModels(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading models...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white">Anaconda Platform</h1>
              <nav className="flex gap-4">
                <a href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</a>
                <a href="/dashboard/notebooks" className="text-gray-400 hover:text-white">Notebooks</a>
                <a href="/dashboard/experiments" className="text-gray-400 hover:text-white">Experiments</a>
                <a href="/dashboard/models" className="text-white">Models</a>
              </nav>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Model Registry</h2>
            <p className="text-gray-400 mt-2">Version, deploy, and monitor models</p>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            + Register Model
          </button>
        </div>

        <div className="space-y-4">
          {models.map(model => (
            <div key={model.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <Box className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{model.name}</h3>
                    <p className="text-gray-400 text-sm">Version: {model.version}</p>
                    <p className="text-gray-400 text-sm">
                      Created {new Date(model.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  model.status === 'staging' ? 'bg-yellow-600/20 text-yellow-400' :
                  model.status === 'production' ? 'bg-green-600/20 text-green-400' :
                  'bg-gray-600/20 text-gray-400'
                }`}>
                  {model.status}
                </span>
              </div>
              
              <div className="mt-4 flex gap-4">
                <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
                  <Play className="h-4 w-4 inline mr-1" />
                  Deploy
                </button>
                <button className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded hover:bg-gray-600">
                  <Download className="h-4 w-4 inline mr-1" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}