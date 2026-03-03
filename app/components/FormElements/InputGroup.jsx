// app/components/FormElements/InputGroup.jsx
export default function InputGroup({
  label,
  type = "text",
  name,
  value,
  handleChange,   // <== on garde ton nom
  placeholder,
  Icon,
  htmlFor,
  className = "",
}) {
  const readOnly = !handleChange;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor || name}
          className="block text-xs font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="flex items-center rounded-lg border border-gray-200 px-3 py-2 focus-within:border-black">
        {typeof Icon === "function" && (
          <Icon className="mr-2 h-4 w-4 text-gray-400" aria-hidden="true" />
        )}
        <input
          id={htmlFor || name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}  // <== ici
          placeholder={placeholder}
          readOnly={readOnly}
          className="flex-1 border-0 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:ring-0"
        />
      </div>
    </div>
  );
}
