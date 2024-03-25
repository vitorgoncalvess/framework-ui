import React from "react";

type Props = {
  options: string[];
};

const Select = ({ options }: Props) => {
  return (
    <select className="bg-transparent border-bd-base border p-2 rounded">
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  );
};

export default Select;
