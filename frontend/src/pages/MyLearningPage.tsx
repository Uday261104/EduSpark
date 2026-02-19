import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCourses } from "@/services/courseService";

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  total_hours: number;
  creator_name: string;
}

function MyLearning() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrolled = async () => {
    try {
      const data = await getMyCourses();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch enrolled courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolled();
  }, []);

  const renderContent = () => {
    if (activeTab !== "all") {
      return (
        <div className="bg-white rounded-xl shadow p-10 text-center mt-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            🚀 Coming Soon
          </h2>
        </div>
      );
    }

    if (loading) {
      return (
        <p className="mt-8 text-gray-600 text-lg">
          Loading courses...
        </p>
      );
    }

    if (courses.length === 0) {
      return (
        <div className="mt-8 bg-white p-10 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            You haven't enrolled in any courses yet.
          </h2>
        </div>
      );
    }

    return (
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="font-semibold text-lg">
                {course.title}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                By {course.creator_name}
              </p>

              <p className="text-sm text-gray-600 mt-2">
                {course.total_hours} total hours
              </p>

              <button
                onClick={() =>
                  navigate(`/learn/course/${course.id}`)
                }
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition"
              >
                Continue Learning
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const Tab = ({ id, label }: { id: string; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`pb-3 border-b-2 transition ${
        activeTab === id
          ? "border-white text-white font-semibold"
          : "border-transparent text-gray-200 hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-10 py-12">
        <h1 className="text-4xl font-bold">
          My Learning
        </h1>

        <div className="flex gap-8 mt-8 text-lg">
          <Tab id="all" label="All Courses" />
          <Tab id="lists" label="My Lists" />
          <Tab id="wishlist" label="Wishlist" />
          <Tab id="certificates" label="Certifications" />
          <Tab id="archived" label="Archived" />
          <Tab id="tools" label="Learning Tools" />
        </div>
      </div>

      {/* Content */}
      <div className="px-10 pb-16">
        {renderContent()}
      </div>
    </div>
  );
}

export default MyLearning;