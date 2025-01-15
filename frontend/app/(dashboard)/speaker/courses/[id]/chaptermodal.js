import CustomFormField from "@/components/shared/customformfield";
import CustomModal from "@/components/shared/custommodal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const ChapterModal = () => {
  const dispatch = () => {};

  const isChapterModalOpen = true;
  const selectedSectionIndex = [0];
  const selectedChapterIndex = [0];
  const sections = [
    {
      sectionId: "5k7l9m1n-3o5p-7q9r-1s3t-5u7v9w1x3y5z",
      sectionTitle: "Getting Started with React Native",
      sectionDescription: "Learn the basics of React Native development.",
      chapters: [
        {
          chapterId: "i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4",
          type: "Video",
          title: "Setting Up Your Development Environment",
          content: "https://example.com/videos/react-native-setup.mp4",
          video: "https://example.com/videos/react-native-setup.mp4",
          comments: [],
        },
        {
          chapterId: "j0k1l2m3-n4o5-p6q7-r8s9-t0u1v2w3x4y5",
          type: "Text",
          title: "React Native Basics",
          content:
            "Learn about functions, objects, and other core concepts in JavaScript...",
          comments: [],
        },
      ],
    },
  ];

  const chapter =
    selectedSectionIndex !== null && selectedChapterIndex !== null
      ? sections[selectedSectionIndex].chapters[selectedChapterIndex]
      : undefined;

  const methods = useForm({
    resolver: zodResolver(),
    defaultValues: {
      title: "",
      content: "",
      video: "",
    },
  });

  useEffect(() => {
    if (chapter) {
      methods.reset({
        title: chapter.title,
        content: chapter.content,
        video: chapter.video || "",
      });
    } else {
      methods.reset({
        title: "",
        content: "",
        video: "",
      });
    }
  }, [chapter, methods]);

  const onClose = () => {
    //dispatch(closeChapterModal());
  };

  const onSubmit = (data) => {
    if (selectedSectionIndex === null) return;

    const newChapter = {
      chapterId: chapter?.chapterId || uuidv4(),
      title: data.title,
      content: data.content,
      type: data.video ? "Video" : "Text",
      video: data.video,
    };

    if (selectedChapterIndex === null) {
      // dispatch(
      //   addChapter({
      //     sectionIndex: selectedSectionIndex,
      //     chapter: newChapter,
      //   })
      // );
    } else {
      // dispatch(
      //   editChapter({
      //     sectionIndex: selectedSectionIndex,
      //     chapterIndex: selectedChapterIndex,
      //     chapter: newChapter,
      //   })
      // );
    }

    toast.success(
      `Chapter added/updated successfully but you need to save the course to apply the changes`
    );
    onClose();
  };

  return (
    <CustomModal isOpen={isChapterModalOpen} onClose={onClose}>
      <div className="chapter-modal">
        <div className="chapter-modal__header">
          <h2 className="chapter-modal__title">Add/Edit Chapter</h2>
          <button onClick={onClose} className="chapter-modal__close">
            <X className="w-6 h-6" />
          </button>
        </div>

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="chapter-modal__form"
          >
            <CustomFormField
              name="title"
              label="Chapter Title"
              placeholder="Write chapter title here"
            />

            <CustomFormField
              name="content"
              label="Chapter Content"
              type="textarea"
              placeholder="Write chapter content here"
            />

            <FormField
              control={methods.control}
              name="video"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel className="text-customgreys-dirtyGrey text-sm">
                    Chapter Video
                  </FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        className="border-none bg-customgreys-darkGrey py-2 cursor-pointer"
                      />
                      {typeof value === "string" && value && (
                        <div className="my-2 text-sm text-gray-600">
                          Current video: {value.split("/").pop()}
                        </div>
                      )}
                      {value instanceof File && (
                        <div className="my-2 text-sm text-gray-600">
                          Selected file: {value.name}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="chapter-modal__actions">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary-700">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default ChapterModal;
