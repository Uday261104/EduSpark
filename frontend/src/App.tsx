import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import LoginPage from "./pages/Login"
import UnauthorizedPage from "./pages/UnauthorizedPage"
import Home from "./pages/Home"
import CreateCoursePage from "./pages/CreateCoursePage"
import ProtectedRoute from "./routes/ProtectedRoute"
import MyLearningPage from "./pages/MyLearningPage"
import Register from "./pages/Register"
import CoursePlayerPage from "./pages/CoursePlayerPage"
import CreateSectionPage from "./pages/CreateSectionPage"
import CreateChapterPage from "./pages/CreateChapterPage"
import NotFoundPage from "./pages/NotFoundPage"
function App() {
  return (
    <>
      <Navbar />
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        <Route
          path="/my-learning"
          element={
            <ProtectedRoute>
              <MyLearningPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learn/course/:id"
          element={
            <ProtectedRoute>
              <CoursePlayerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-course"
          element={
            <ProtectedRoute requiredPermission="can_create_course">
              <CreateCoursePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-section/:courseId"
          element={
            <ProtectedRoute requiredPermission="can_create_course">
              <CreateSectionPage />
            </ProtectedRoute>
          }
        />
         <Route
          path="/courses/:courseId/chapters/create/"
          element={
            <ProtectedRoute requiredPermission="can_create_course">
              <CreateChapterPage />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage/>}/>

      </Routes>
    </>
  )
}

export default App