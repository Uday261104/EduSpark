import { useNavigate } from "react-router-dom";
import { enrollInCourse } from "@/services/courseService";
type Course = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  total_hours: number;
  is_enrolled: boolean;
};

type Props = {
  course: Course;
};

export default function CourseCard({ course }: Props) {
  const navigate = useNavigate();

  const handleEnroll = async () => {
  if (!course.is_enrolled) {
    await enrollInCourse(course.id);
    navigate("/my-learning");
  }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
      
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold">
          {course.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3">
          {course.description}
        </p>

        <button
          onClick={handleEnroll}
          className={`w-full py-3 rounded-xl text-white font-medium transition ${
            course.is_enrolled
              ? "bg-green-500"
              : "bg-gradient-to-r from-purple-500 to-purple-700 hover:opacity-90"
          }`}
        >
          {course.is_enrolled ? "Enrolled" : "Enroll Now"}
        </button>
      </div>
    </div>
  );
}