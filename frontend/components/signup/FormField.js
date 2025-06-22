import { memo } from "react";

const FormField = memo(({ 
  label, 
  name, 
  type = "text", 
  required = false, 
  placeholder = "", 
  options = null, 
  className = "",
  value,
  onChange,
  error
}) => (
  <div className={className}>
    <label className="text-gray-800 text-sm block mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative flex items-center">
      {options ? (
        <select
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none bg-transparent"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
          placeholder={placeholder}
        />
      )}
    </div>
    {error && (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    )}
  </div>
));

FormField.displayName = 'FormField';

export default FormField; 
