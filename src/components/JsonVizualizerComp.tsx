import { PipeComponent } from "@/utils/factories/componentFactory";
import React from "react";

type Props = {
  object: PipeComponent;
};

const JsonVizualizerComp = ({ object }: Props) => {
  object.callback = function (data: any) {
    console.log(data);
  };
  return <div>JsonVizualizerComp</div>;
};

export default JsonVizualizerComp;
