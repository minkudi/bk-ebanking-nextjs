'use client';

export function Checkbox({ label, name, onChange }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium">
      <input
        type="checkbox"
        name={name}
        onChange={onChange}
        className="h-5 w-5 cursor-pointer rounded border-gray-300 text-[#3c50e0] focus:ring-[#3c50e0]"
      />
      <span>{label}</span>
    </label>
  );
}
