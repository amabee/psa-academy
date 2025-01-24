import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const courseCategories = [
  { value: "technology", label: "Technology" },
  { value: "science", label: "Science" },
  { value: "mathematics", label: "Mathematics" },
  { value: "artificial-intelligence", label: "Artificial Intelligence" },
];

export function centsToDollars(cents) {
  return ((cents || 0) / 100).toString();
}

export const createCourseFormData = (data, sections) => {
  const formData = new FormData();
  formData.append("title", data.courseTitle);
  formData.append("description", data.courseDescription);
  formData.append("category", data.courseCategory);
  formData.append("price", data.coursePrice.toString());
  formData.append("status", data.courseStatus ? "Published" : "Draft");

  const sectionsWithVideos = sections.map((section) => ({
    ...section,
    chapters: section.chapters.map((chapter) => ({
      ...chapter,
      video: chapter.video,
    })),
  }));

  formData.append("sections", JSON.stringify(sectionsWithVideos));

  return formData;
};

export const uploadAllVideos = async (
  localSections,
  courseId,
  getUploadVideoUrl
) => {
  const updatedSections = localSections.map((section) => ({
    ...section,
    chapters: section.chapters.map((chapter) => ({
      ...chapter,
    })),
  }));

  for (let i = 0; i < updatedSections.length; i++) {
    for (let j = 0; j < updatedSections[i].chapters.length; j++) {
      const chapter = updatedSections[i].chapters[j];
      if (chapter.video instanceof File && chapter.video.type === "video/mp4") {
        try {
          const updatedChapter = await uploadVideo(
            chapter,
            courseId,
            updatedSections[i].sectionId,
            getUploadVideoUrl
          );
          updatedSections[i].chapters[j] = updatedChapter;
        } catch (error) {
          console.error(
            `Failed to upload video for chapter ${chapter.chapterId}:`,
            error
          );
        }
      }
    }
  }

  return updatedSections;
};

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
