'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, FlaskConical, Box, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = document.cookie
      .split('; ')
      .find(row => row.startsWith('session='))
      ?.split('=')[1];

    if (!session) {
      router.push('/login');
      return;
    }

    fetch('/api/auth', {
      headers: { Cookie: `session=${session}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          router.push('/login');
          return;
        }
        setUser(data.user);
        setLoading(false);
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Anaconda Platform</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">{user?.email}</span>
              <button onClick={handleLogout} className="text-gray-400 hover:text-white">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400 mt-2">Manage your data science projects</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/dashboard/notebooks" className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Notebooks</p>
                <p className="text-gray-400 text-sm">Jupyter Lab environment</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/experiments" className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-600/20 rounded-lg">
                <FlaskConical className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">Experiments</p>
                <p className="text-gray-400 text-sm">ML experiment tracking</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/models" className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-600/20 rounded-lg">
                <Box className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">Model Registry</p>
                <p className="text-gray-400 text-sm">Model versioning & deployment</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded">
              <div>
                <p className="text-white font-medium">Experiment: Image Classification</p>
                <p className="text-gray-400 text-sm">Accuracy: 94.5%</p>
              </div>
              <span className="text-green-400 text-sm">Completed</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded">
              <div>
                <p className="text-white font-medium">Model: ResNet50 v2</p>
                <p className="text-gray-400 text-sm">Registered to model registry</p>
              </div>
              <span className="text-blue-400 text-sm">Staging</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}