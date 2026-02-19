import api from "./api";

/* ===============================
   TYPES
================================= */

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  total_hours: number;
  is_enrolled: boolean;
}

export interface Section {
  id: number;
  title: string;
  course: number;
}

export interface Chapter {
  id: number;
  title: string;
  section: number;
  content: string;
}

/* ===============================
   COURSE SERVICES
================================= */

// GET /courses/
export const getCourses = async (): Promise<Course[]> => {
  const response = await api.get<Course[]>("/courses/");
  return response.data;
};

// POST /courses/create/
export const createCourse = async (formData: FormData) => {
  return api.post("/courses/create/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// PUT /courses/<id>/update/
export const updateCourse = async (
  courseId: number,
  data: Partial<Course>
) => {
  return api.put(`/courses/${courseId}/update/`, data);
};

/* ===============================
   ENROLLMENT SERVICES
================================= */

// POST /courses/<id>/enroll/
export const enrollInCourse = async (courseId: number) => {
  return api.post(`/courses/${courseId}/enroll/`);
};

// GET /my-courses/
export const getMyCourses = async () => {
  const response = await api.get("/my-courses/");
  return response.data;
};

// GET /courses/<id>/learn/
export const learnCourse = async (courseId: number) => {
  const response = await api.get(`/courses/${courseId}/learn/`);
  console.log("==========", response)
  return response.data;
};


/* ===============================
   SECTION SERVICES
================================= */

// POST /sections/create/
export const createSection = async (
  title: string,
  description: string,
  courseId: number
) => {
  return api.post(`/sections/${courseId}/create/`, {
    title,
    description,
    course: courseId,   
  });
};

// PUT /sections/<id>/update/
export const updateSection = async (
  sectionId: number,
  data: Partial<Section>
) => {
  return api.put(`/sections/${sectionId}/update/`, data);
};

// DELETE /sections/<id>/delete/
export const deleteSection = async (sectionId: number) => {
  return api.delete(`/sections/${sectionId}/delete/`);
};

/* ===============================
   CHAPTER SERVICES
================================= */

// POST /courses/<id>/chapters/create/
export const createChapter = async (
  courseId: number,
  sectionId: number,
  title: string,
  videoUrl: string
) => {
  return api.post(`/courses/${courseId}/chapters/create/`, {
    title,
    video_url: videoUrl,
    video_duration: 10,   // temporary default
    order: 1,             // temporary default
    section: sectionId,
  });
};

// PUT /chapters/<id>/update/
export const updateChapter = async (
  chapterId: number,
  data: Partial<Chapter>
) => {
  return api.put(`/chapters/${chapterId}/update/`, data);
};

// DELETE /chapters/<id>/delete/
export const deleteChapter = async (chapterId: number) => {
  return api.delete(`/chapters/${chapterId}/delete/`);
};