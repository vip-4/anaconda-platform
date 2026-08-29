import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Anaconda Data Science Platform</h1>
        <p className="text-gray-400 mb-8">Cloud-native data science platform</p>
        <Link href="/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}