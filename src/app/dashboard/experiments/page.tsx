'use client';

import { useState, useEffect } from 'react';
import { FlaskConical, Play, BarChart3 } from 'lucide-react';

interface Experiment {
  id: string;
  name: string;
  params: any;
  metrics: any;
  status: string;
  created_at: string;
}

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/experiments')
      .then(res => res.json())
      .then(data => {
        setExperiments(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading experiments...</div>
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
                <a href="/dashboard/experiments" className="text-white">Experiments</a>
                <a href="/dashboard/models" className="text-gray-400 hover:text-white">Models</a>
              </nav>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Experiments</h2>
            <p className="text-gray-400 mt-2">Track and compare ML experiments</p>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            + New Experiment
          </button>
        </div>

        <div className="space-y-4">
          {experiments.map(exp => (
            <div key={exp.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-600/20 rounded-lg">
                    <FlaskConical className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{exp.name}</h3>
                    <p className="text-gray-400 text-sm">
                      Created {new Date(exp.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  exp.status === 'running' ? 'bg-yellow-600/20 text-yellow-400' :
                  exp.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                  'bg-gray-600/20 text-gray-400'
                }`}>
                  {exp.status}
                </span>
              </div>
              
              <div className="mt-4 flex gap-4">
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  View Details
                </button>
                <button className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded hover:bg-gray-600">
                  <BarChart3 className="h-4 w-4 inline mr-1" />
                  Metrics
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}