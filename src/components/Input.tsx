import React, { ChangeEventHandler } from "react";

type Props = {
  label: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

const Input = ({ label, onChange }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="opacity-80">{label}</label>
      <input
        onChange={onChange}
        className="border border-bd-base bg-transparent h-8 rounded p-2 outline-none"
        type="text"
      />
    </div>
  );
};

export default Input;
