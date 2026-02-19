import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-6">
      <div className="text-center bg-white shadow-xl rounded-2xl p-12 max-w-lg w-full">

        {/* 404 */}
        <h1 className="text-7xl font-extrabold text-purple-600 mb-4">
          404
        </h1>

        <h2 className="text-2xl font-bold mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-purple-600 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Go Back Home
        </Link>

      </div>
    </div>
  );
}

export default NotFoundPage;