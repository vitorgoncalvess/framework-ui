import React, { Dispatch, SetStateAction, useState } from "react";
import components, { Component } from "@/utils/models/components";
import PipeComponent from "./PipeComponent";
import componentFactory, {
  PipeComponent as Type,
} from "@/utils/factories/componentFactory";
import Image from "next/image";
import menu from "@images/menu.svg";

type Props = {
  setObjects: Dispatch<SetStateAction<Type[]>>;
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

  const handleClickOutside = (e: any) => {
    if (e.target === e.currentTarget) setIsOpen(false);
  };

  return (
    <div
      onClick={handleClickOutside}
      className="absolute top-0 left-0 right-0 bottom-0"
    >
      <div
        style={{
          transform: isOpen ? "translateX(0px)" : "translateX(-258px)",
        }}
        className="absolute bg-black z-[9999] top-0 bottom-0 left-0 border-r w-64 border-bd-base transition-all duration-300 overflow-auto p-4 flex flex-col gap-4"
      >
        {components.map((component, index) => (
          <PipeComponent
            onClick={() => handleNew(component)}
            key={index}
            component={component}
          />
        ))}
      </div>
      <div className="p-2">
        <button
          style={{
            transform: isOpen ? "translateX(256px)" : "translateX(0px)",
          }}
          className="absolute z-10 transition-all duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Image src={menu} alt="menu" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
