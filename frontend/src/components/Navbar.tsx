import { Link, useNavigate } from "react-router-dom";
import authorization from "@/core/Authorization";
import { Button } from "@/components/ui/button";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    authorization.clear();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            EduSpark
          </Link>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-purple-600 transition">
            Home
          </Link>

          {isLoggedIn && !authorization.isAuthorized("can_create_course") && (
            <Link
              to="/my-learning"
              className="hover:text-purple-600 transition"
            >
              My Learning
            </Link>
          )}

          {authorization.isAuthorized("can_create_course") && (
            <Link
              to="/create-course"
              className="hover:text-purple-600 transition"
            >
              Create Course
            </Link>
          )}

          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 rounded-xl px-6"
            >
              Logout
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 rounded-xl px-6"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>

              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6"
                asChild
              >
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;