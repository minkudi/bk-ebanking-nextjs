'use client';

export default function InputGroup({ 
  type, 
  label, 
  placeholder, 
  name, 
  value, 
  handleChange, 
  icon, 
  className = '' 
}) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-11 text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        />
        {icon && (
          <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}
