import { Component } from "@/utils/models/components";
import React from "react";

type Props = {
  component: Component;
  onClick: any;
};

const PipeComponent = ({ component, onClick }: Props) => {
  const { name, description } = component;
  return (
    <div
      onClick={onClick}
      className="border border-zinc-900 rounded p-2 flex flex-col cursor-pointer gap-2"
    >
      <div className="bg-bd-base h-24 rounded-sm"></div>
      <div>
        <h1 className="font-medium">{name}</h1>
        <h2 className="opacity-50 text-sm">{description}</h2>
      </div>
    </div>
  );
};

export default PipeComponent;
