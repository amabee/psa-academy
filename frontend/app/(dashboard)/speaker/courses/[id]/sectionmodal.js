import CustomFormField from "@/components/shared/customformfield";
import CustomModal from "@/components/shared/custommodal";
import { Button } from "@/components/ui/button";
import useStore from "@/state";
import { X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const SectionModal = () => {
  const isSectionModalOpen = useStore(
    (state) => state.courseEditor.isSectionModalOpen
  );
  const closeSectionModal = useStore((state) => state.closeSectionModal);

  const addSection = useStore((state) => state.addSection);

  const selectedSectionIndex = useStore(
    (state) => state.courseEditor.selectedSectionIndex
  );

  const sections = useStore((state) => state.courseEditor.sections);

  // Get the specific section if we're editing
  const section =
    selectedSectionIndex !== null ? sections[selectedSectionIndex] : null;

  const [formData, setFormData] = useState({
    title: section?.sectionTitle || "",
    description: section?.sectionDescription || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onClose = () => {
    setFormData({ title: "", description: "" });
    closeSectionModal();
  };

  const onSubmit = () => {
    try {
      console.log("Submitting section..."); // Debug log

      const newSection = {
        sectionId: uuidv4(),
        sectionTitle: formData.title,
        sectionDescription: formData.description,
        chapters: [],
      };

      addSection(newSection);

      toast.success("Section added successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting section:", error);
      toast.error("Failed to save section");
    }
  };

  return (
    <CustomModal isOpen={isSectionModalOpen} onClose={onClose}>
      <div className="section-modal">
        <div className="section-modal__header">
          <h2 className="section-modal__title">
            {selectedSectionIndex === null ? "Add Section" : "Edit Section"}
          </h2>
          <button onClick={onClose} className="section-modal__close">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <CustomFormField
            name="title"
            label="Section Title"
            placeholder="Write section title here"
            value={formData.title}
            onChange={handleChange}
          />

          <CustomFormField
            name="description"
            label="Section Description"
            type="textarea"
            placeholder="Write section description here"
            value={formData.description}
            onChange={handleChange}
          />

          <div className="section-modal__actions">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary-700"
              disabled={!formData.title || !formData.description}
              onClick={onSubmit}
            >
              {selectedSectionIndex === null ? "Add Section" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default SectionModal;
