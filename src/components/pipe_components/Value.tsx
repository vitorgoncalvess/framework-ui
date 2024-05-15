"use client";

import Select from "../Select";
import Input from "../Input";
import useObjectStore from "@/store/objectsStore";

type Props = {
  id: string;
};

export const config = {
  name: "Objeto",
  description: "Objeto que irá armazerar um valor.",
  options: ["Number"],
  output: "VALUE",
  data: {
    value: null,
  },
};

const Value = ({ id }: Props) => {
  const updateData = useObjectStore((state) => state.updateData);

  return (
    <div className="flex flex-col gap-2">
      <header className="flex justify-between items-center">
        <h1 className="font-semibold">Value Type</h1>
        <Select
          onChange={(value) => updateData(id, { type: value })}
          options={config.options}
        />
      </header>
      <Input
        onChange={({ target }) =>
          updateData(id, { value: Number(target.value) })
        }
        label="Value"
      />
    </div>
  );
};

export default Value;
