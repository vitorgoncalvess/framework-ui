import React from "react";

type Props = {
  options: string[];
  onChange: (val: string) => void;
};

const Select = ({ options, onChange }: Props) => {
  return (
    <select
      onChange={({ target }) => onChange(target.value)}
      className="bg-transparent border-bd-base border p-2 rounded"
    >
      {options.map((opt) => (
        <option value={opt} key={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};

export default Select;
