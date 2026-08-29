'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Play, Trash2 } from 'lucide-react';

interface Notebook {
  id: string;
  title: string;
  kernel: string;
  updated_at: string;
}

export default function NotebooksPage() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notebooks')
      .then(res => res.json())
      .then(data => {
        setNotebooks(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading notebooks...</div>
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
                <a href="/dashboard/notebooks" className="text-white">Notebooks</a>
                <a href="/dashboard/experiments" className="text-gray-400 hover:text-white">Experiments</a>
                <a href="/dashboard/models" className="text-gray-400 hover:text-white">Models</a>
              </nav>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Notebooks</h2>
            <p className="text-gray-400 mt-2">Interactive Jupyter notebooks</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            + New Notebook
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notebooks.map(notebook => (
            <div key={notebook.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-xs text-gray-400">{notebook.kernel}</span>
              </div>
              <h3 className="text-white font-medium mb-2">{notebook.title}</h3>
              <p className="text-gray-400 text-sm mb-4">
                Updated {new Date(notebook.updated_at).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  Open
                </button>
                <button className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded hover:bg-gray-600">
                  <Play className="h-4 w-4" />
                </button>
                <button className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded hover:bg-gray-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}