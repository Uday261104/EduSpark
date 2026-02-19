import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getCourses, enrollInCourse } from "@/services/courseService";
import type { Course } from "@/services/courseService";
import CourseCard from "./CourseCard";
const categories: string[] = [
  "Web Development",
  "Data Science",
  "Cloud Computing",
  "DevOps",
  "Mobile Apps",
  "Databases",
  "AI & ML",
  "Cyber Security",
];

const banners = [
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    title: "Share the gift of learning",
    subtitle: "Save 20% on a year of unlimited access to 26K+ top courses.",
    cta: "Explore courses",
  },
  {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    title: "Upskill Faster",
    subtitle: "Learn from industry experts worldwide.",
    cta: "Start learning",
  },
  {
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8",
    title: "Career-Ready Skills",
    subtitle: "AI, Web, Cloud & Data career paths.",
    cta: "View paths",
  },
];

interface Feature {
  icon: string;
  title: string;
  desc: string;
}
const features: Feature[] = [
  {
    icon: "🎓",
    title: "Expert Instructors",
    desc: "Learn from industry professionals.",
  },
  {
    icon: "🛠️",
    title: "Hands-On Projects",
    desc: "Build real-world applications.",
  },
  {
    icon: "⏱️",
    title: "Flexible Learning",
    desc: "Learn anytime, anywhere.",
  },
  {
    icon: "📈",
    title: "Career Growth",
    desc: "Upskill for better opportunities.",
  },
];

const Home = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  
  const [current, setCurrent] = useState(0);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } 
    };

    fetchCourses();
  }, []);


    const handleEnroll = async (courseId: number) => {
        try {
        await enrollInCourse(courseId);
        alert("Enrolled successfully!");
        navigate("/my-courses");
        } catch (error: any) {
        const message =
            error.response?.data?.detail || "Please login first";
        alert(message);
        navigate("/login");
        }
    };
  /* ================= AUTO SLIDE ================= */
    useEffect(() => {
        const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ================= WELCOME ================= */}
      { (
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Welcome, 
            <span className="text-purple-600">Learner</span> 👋
          </h2>
        </div>
      )}

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-4 pt-6">
        <div className="relative h-[300px] rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.7 }}
            >
              <img
                src={banners[current].image}
                className="h-full w-full object-cover"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700/90 to-purple-500/60" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 h-full flex items-center px-10">
            <div className="max-w-xl text-white">
              <h1 className="text-3xl font-bold">
                {banners[current].title}
              </h1>
              <p className="mt-3 text-white/90">
                {banners[current].subtitle}
              </p>
              <button className="mt-5 bg-white text-purple-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition">
                {banners[current].cta}
              </button>
            </div>
          </div>
        </div>
      </section>
{/* ================= FEATURES ================= */}
<section className="max-w-7xl mx-auto px-4 py-14">
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {features.map((f) => (
      <motion.div
        key={f.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
      >
        <div className="text-3xl">{f.icon}</div>
        <h3 className="mt-4 font-semibold text-gray-900">
          {f.title}
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          {f.desc}
        </p>
      </motion.div>
    ))}
  </div>
</section>

{/* ================= CATEGORIES ================= */}
<section className="max-w-7xl mx-auto px-4 pb-12">
  <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">
    Popular Categories
  </h2>

  <div className="flex flex-wrap justify-center gap-4">
    {categories.map((cat) => (
      <div
        key={cat}
        className="bg-white px-5 py-2 rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition cursor-pointer"
      >
        {cat}
      </div>
    ))}
  </div>
</section>

      {/* ================= TOP COURSES ================= */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-2xl font-bold text-center mb-10">
                    Top Courses
                </h2>

                {courses.length === 0 ? (
                    <p className="text-center text-gray-500">
                    No courses available.
                    </p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                    </div>
                )}
                </section>

      {/* ================= CTA ================= */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl font-bold">
            Start Learning Today
          </h2>
          <p className="text-gray-600 mt-3">
            Join thousands of learners building real-world skills.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Create Free Account
          </button>
        </div>
      </section>


      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8 text-sm">
        <div className="font-semibold text-white mb-1">
          EduSpark
        </div>
        <p>Learn. Build. Grow.</p>
        <p className="mt-2">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
