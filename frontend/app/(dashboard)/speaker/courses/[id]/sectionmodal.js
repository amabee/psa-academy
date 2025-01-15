import CustomFormField from "@/components/shared/customformfield";
import CustomModal from "@/components/shared/custommodal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { addSection, closeSectionModal, editSection } from "@/state";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const SectionModal = () => {
  const dispatch = () => {};
  // const { isSectionModalOpen, selectedSectionIndex, sections } = useAppSelector(
  //   (state) => state.global.courseEditor
  // );

  const isSectionModalOpen = false;
  const selectedSectionIndex = [0];
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

  const section =
    selectedSectionIndex !== null ? sections[selectedSectionIndex] : null;

  const methods = useForm({
    resolver: zodResolver(),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (section) {
      methods.reset({
        title: section.sectionTitle,
        description: section.sectionDescription,
      });
    } else {
      methods.reset({
        title: "",
        description: "",
      });
    }
  }, [section, methods]);

  const onClose = () => {
    // dispatch(closeSectionModal());
  };

  const onSubmit = (data) => {
    const newSection = {
      sectionId: section?.sectionId || uuidv4(),
      sectionTitle: data.title,
      sectionDescription: data.description,
      chapters: section?.chapters || [],
    };

    if (selectedSectionIndex === null) {
      // dispatch(addSection(newSection));
    } else {
      // dispatch(
      //   editSection({
      //     index: selectedSectionIndex,
      //     section: newSection,
      //   })
      // );
    }

    toast.success(
      `Section added/updated successfully but you need to save the course to apply the changes`
    );
    onClose();
  };

  return (
    <CustomModal isOpen={isSectionModalOpen} onClose={onClose}>
      <div className="section-modal">
        <div className="section-modal__header">
          <h2 className="section-modal__title">Add/Edit Section</h2>
          <button onClick={onClose} className="section-modal__close">
            <X className="w-6 h-6" />
          </button>
        </div>

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="section-modal__form"
          >
            <CustomFormField
              name="title"
              label="Section Title"
              placeholder="Write section title here"
            />

            <CustomFormField
              name="description"
              label="Section Description"
              type="textarea"
              placeholder="Write section description here"
            />

            <div className="section-modal__actions">
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

export default SectionModal;
