import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createChapter } from "@/services/courseService";
import { useLocation } from "react-router-dom";
function CreateChapter() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;

    try {
      setLoading(true);
      await createChapter(
  Number(courseId),
  Number(data?.sid),
  title,
  content
  );
      navigate(-1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl p-10">
        
        {/* Heading */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          Create Chapter
        </h1>
        <p className="text-gray-500 mt-2">
          Add chapters to organize your course content
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          {/* Chapter Title */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Chapter Title
            </label>
            <input
              type="text"
              placeholder="Enter chapter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl border-2 border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
          </div>

          {/* Section ID */}
          {/* <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Section ID
            </label>
            <input
              type="number"
              placeholder="Enter section id"
              value={sectionId}
              onChange={(e) => setSectionId(Number(e.target.value))}
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
          </div> */}

          {/* Content URL */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Content URL
            </label>
            <textarea
              placeholder="Enter video / pdf URL"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-2xl bg-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
          </div>

          <hr className="my-6" />

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl border border-gray-400 text-gray-600 hover:bg-gray-100 transition"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:opacity-90 transition"
            >
              {loading ? "Saving..." : "Save Chapter"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateChapter;