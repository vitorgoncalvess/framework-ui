import React, { Dispatch, SetStateAction, useState } from "react";
import components, { Component } from "@/utils/models/components";
import PipeComponent from "./PipeComponent";
import componentFactory from "@/utils/factories/componentFactory";

type Props = {
  setObjects: Dispatch<SetStateAction<any[]>>;
};

const Sidebar = ({ setObjects }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const factory = componentFactory();

  const handleNew = (component: Component) => {
    setObjects((objects) => [
      ...objects,
      factory.createNewComponent(component),
    ]);
  };

  return (
    <div>
      <div
        style={{
          transform: isOpen ? "translateX(0px)" : "translateX(-256px)",
        }}
        className="absolute bg-black z-10 top-0 bottom-0 left-0 border-r w-64 border-zinc-800 transition-all duration-300 overflow-hidden p-4 flex flex-col gap-4"
      >
        {components.map((component, index) => (
          <PipeComponent
            onClick={() => handleNew(component)}
            key={index}
            component={component}
          />
        ))}
      </div>
      <button
        style={{
          transform: isOpen ? "translateX(256px)" : "translateX(0px)",
        }}
        className="absolute z-10 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Fechar" : "Abrir"}
      </button>
    </div>
  );
};

export default Sidebar;
