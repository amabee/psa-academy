import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, X, Plus } from "lucide-react";
import { registerPlugin } from "filepond";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Switch } from "../ui/switch";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const CustomFormField = ({
  name,
  label,
  type = "text",
  placeholder,
  options,
  accept,
  className,
  inputClassName,
  labelClassName,
  disabled = false,
  multiple = false,
  isIcon = false,
  value,
  onChange,
  initialValue,
}) => {
  const renderFormControl = () => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            rows={3}
            className={`border-none bg-customgreys-darkGrey p-4 ${inputClassName}`}
          />
        );
      case "select":
        return (
          <Select
            value={value || initialValue}
            onValueChange={(newValue) =>
              onChange({ target: { name, value: newValue } })
            }
          >
            <SelectTrigger
              className={`w-full border-none bg-customgreys-primarybg p-4 ${inputClassName}`}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="w-full bg-customgreys-primarybg border-customgreys-dirtyGrey shadow">
              {options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer hover:!bg-gray-100 hover:!text-customgreys-darkGrey"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "switch":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value}
              onCheckedChange={(checked) =>
                onChange({ target: { name, value: checked } })
              }
              id={name}
              className={`${inputClassName}`}
            />
            <Label htmlFor={name} className={labelClassName}>
              {label}
            </Label>
          </div>
        );
      case "file":
        const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
        const acceptedFileTypes = accept ? [accept] : ACCEPTED_VIDEO_TYPES;

        return (
          <FilePond
            className={`${inputClassName}`}
            files={value ? [value] : []}
            allowMultiple={multiple}
            onupdatefiles={(fileItems) => {
              onChange({
                target: {
                  name,
                  value: multiple
                    ? fileItems.map((fileItem) => fileItem.file)
                    : fileItems[0]?.file,
                },
              });
            }}
            acceptedFileTypes={acceptedFileTypes}
            labelIdle={`Drag & Drop your files or <span class="filepond--label-action">Browse</span>`}
            credits={false}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            className={`border-none bg-customgreys-darkGrey p-4 ${inputClassName}`}
            disabled={disabled}
          />
        );
      case "multi-input":
        return (
          <MultiInputField
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            inputClassName={inputClassName}
          />
        );
      default:
        return (
          <Input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            className={`border-none bg-customgreys-primarybg p-4 ${inputClassName}`}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div
      className={`${type !== "switch" && "rounded-md"} relative ${className}`}
    >
      {type !== "switch" && (
        <div className="flex justify-between items-center">
          <Label
            htmlFor={name}
            className={`text-customgreys-dirtyGrey text-sm ${labelClassName}`}
          >
            {label}
          </Label>

          {!disabled && isIcon && type !== "file" && type !== "multi-input" && (
            <Edit className="size-4 text-customgreys-dirtyGrey" />
          )}
        </div>
      )}
      {renderFormControl()}
    </div>
  );
};

const MultiInputField = ({
  name,
  value = [],
  onChange,
  placeholder,
  inputClassName,
}) => {
  const handleAdd = () => {
    onChange({
      target: {
        name,
        value: [...value, ""],
      },
    });
  };

  const handleRemove = (index) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange({
      target: {
        name,
        value: newValue,
      },
    });
  };

  const handleInputChange = (index, inputValue) => {
    const newValue = [...value];
    newValue[index] = inputValue;
    onChange({
      target: {
        name,
        value: newValue,
      },
    });
  };

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            value={item}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder={placeholder}
            className={`flex-1 border-none bg-customgreys-darkGrey p-4 ${inputClassName}`}
          />
          <Button
            type="button"
            onClick={() => handleRemove(index)}
            variant="ghost"
            size="icon"
            className="text-customgreys-dirtyGrey"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={handleAdd}
        variant="outline"
        size="sm"
        className="mt-2 text-customgreys-dirtyGrey"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
};

export default CustomFormField;
