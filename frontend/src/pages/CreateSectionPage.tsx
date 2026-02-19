import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { createSection } from "@/services/courseService"

function CreateSectionPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!courseId) return

    const res = await createSection(
      title,
      description,
      Number(courseId)
    )
    console.log(res)
    console.log(res.data.id);
    navigate(`/courses/${courseId}/chapters/create/`,{state: {sid: res.data.id}})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-gray-100 py-12">
      <div className="w-[80%] mx-auto bg-white rounded-3xl shadow-2xl p-12">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-purple-600">
            Create Section
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Add sections to organize your course content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="grid md:grid-cols-2 gap-10">

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Section Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-5 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Section Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-5 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

          </div>

          <div className="flex justify-between items-center pt-8 border-t">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl border border-gray-400 text-gray-600 font-medium hover:bg-gray-100 transition"
            >
              Back
            </button>

            <button
              type="submit"
              className="px-10 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:opacity-90 transition"
            >
              Save Section
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}

export default CreateSectionPage;