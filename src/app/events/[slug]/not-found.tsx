import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Event Not Found</h2>
        <p className="text-gray-600 mb-8">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          href="/events"
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Back to Events
        </Link>
      </div>
    </div>
  );
} 