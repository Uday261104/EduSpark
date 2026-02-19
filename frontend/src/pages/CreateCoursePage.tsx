import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {createCourse} from "@/services/courseService"

function CreateCoursePage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [isPublished, setIsPublished] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("requirements", requirements)
    formData.append("is_published", String(isPublished))
    if (thumbnail) formData.append("thumbnail", thumbnail)

    const res = await createCourse(formData)

    navigate(`/create-section/${res.data.id}`)

  } catch (error) {
    console.error("Error creating course:", error)
    alert("Failed to create course")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-gray-100 py-12">
      <div className="w-[80%] mx-auto bg-white rounded-3xl shadow-2xl p-12">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-purple-600">
            Create Course
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Add detailed information to publish your course
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-10">

            {/* Left Column */}
            <div className="space-y-6">

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Course Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-5 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Thumbnail
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setThumbnail(e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                <label className="text-gray-700 font-medium">
                  Publish Course
                </label>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Description
                </label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-5 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Requirements
                </label>
                <textarea
                  rows={5}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  required
                  className="w-full px-5 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

            </div>
          </div>

          <div className="pt-8 border-t text-right">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default CreateCoursePage