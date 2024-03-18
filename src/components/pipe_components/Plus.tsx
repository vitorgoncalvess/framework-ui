import React from "react";
import { PipeComponent } from "@/utils/factories/componentFactory";

type Props = {
  object: PipeComponent;
};

const Plus = ({ object }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-medium">Plus</h1>
      <h2>Result</h2>
      <div className="border border-bd-base h-8 w-36 rounded"></div>
    </div>
  );
};

export default Plus;
