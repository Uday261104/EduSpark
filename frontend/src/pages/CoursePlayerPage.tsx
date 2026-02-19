import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { learnCourse } from "@/services/courseService";


interface Chapter {
  id: number;
  title: string;
  video_url: string | null;
}

interface Section {
  id: number;
  title: string;
  chapters: Chapter[];
}

interface CourseResponse {
  id: number;
  title: string;
  description: string;
  sections: Section[];
}

function CoursePlayerPage() {
  const { id } = useParams<{ id: string }>();
  const courseId = id ? Number(id) : null;

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] =
    useState<Chapter | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const data: CourseResponse = await learnCourse(courseId!);

      setCourseTitle(data.title);
      setCourseDescription(data.description);

      // Flatten all chapters from sections
      const allChapters = data.sections.flatMap(
        (section) => section.chapters
      );

      setChapters(allChapters);

      if (allChapters.length > 0) {
        setSelectedChapter(allChapters[0]);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load course content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* MAIN AREA */}
      <div className="flex-1">
        <div className="max-w-6xl mx-auto">
          {/* VIDEO SECTION */}
          <div className="bg-black text-white p-6">
            {loading ? (
              <div className="w-full h-[70vh] flex items-center justify-center">
                <p>Loading...</p>
              </div>
            ) : selectedChapter ? (
              <>
                <h1 className="text-2xl font-bold mb-4">
                  {selectedChapter.title}
                </h1>

                {selectedChapter.video_url ? (
                  selectedChapter.video_url.includes("youtube") ? (
                    <iframe
                      key={selectedChapter.id}
                      className="w-full h-[70vh] rounded"
                      src={`https://www.youtube.com/embed/${
                        new URL(selectedChapter.video_url).searchParams.get("v")
                      }`}
                      title={selectedChapter.title}
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video
                      key={selectedChapter.id}
                      controls
                      className="w-full h-[70vh] object-contain rounded bg-black"
                    >
                      <source
                        src={selectedChapter.video_url}
                        type="video/mp4"
                      />
                    </video>
                  )
                ) : (
                  <div className="w-full h-[70vh] flex items-center justify-center">
                    <p>No video available</p>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-[70vh] flex items-center justify-center">
                <p>No lessons available</p>
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="bg-white p-8">
            <div className="flex gap-8 border-b mb-6">
              <button
                className={`pb-2 ${
                  activeTab === "overview"
                    ? "border-b-2 border-blue-600 font-semibold"
                    : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>

              <button
                className={`pb-2 ${
                  activeTab === "description"
                    ? "border-b-2 border-blue-600 font-semibold"
                    : ""
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
            </div>

            {activeTab === "overview" && (
              <div>
                <h2 className="text-xl font-bold mb-3">
                  {courseTitle}
                </h2>
                <p className="text-gray-700">
                  Select a lesson from the sidebar to start learning.
                </p>
              </div>
            )}

            {activeTab === "description" && (
              <div>
                <h2 className="text-xl font-bold mb-3">
                  Course Description
                </h2>
                <p className="text-gray-700">
                  {courseDescription}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="w-80 bg-white border-l p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Course Content
        </h2>

        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className={`p-3 rounded cursor-pointer mb-2 ${
              selectedChapter?.id === chapter.id
                ? "bg-blue-100"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setSelectedChapter(chapter)}
          >
            {chapter.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursePlayerPage;