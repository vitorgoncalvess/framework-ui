import React, { useEffect } from "react";
import Select from "../Select";
import COMP_VALUE_OPTIONS from "@/utils/models/comp_value_options";
import Input from "../Input";
import { PipeComponent } from "@/utils/factories/componentFactory";

type Props = {
  object: PipeComponent;
};

const Value = ({ object }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <header className="flex justify-between items-center">
        <h1 className="font-semibold">Value Type</h1>
        <Select options={COMP_VALUE_OPTIONS} />
      </header>
      <Input
        onChange={({ target }) => (object.data = target.value)}
        label="Value"
      />
    </div>
  );
};

export default Value;
