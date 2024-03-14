"use client";

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { PipeComponent } from "@/utils/factories/componentFactory";

const Pipeline = () => {
  const [objects, setObjects] = useState<PipeComponent[]>([]);
  const [isMoving, setIsMoving] = useState<any>(null);
  const [obj, setObj] = useState<number | any>(null);
  const comps = useRef<any>([]);
  const line = useRef<any>(null);

  const handleClick = (e: any) => {
    setIsMoving(e);
  };

  const handleStop = () => {
    setIsMoving(null);
  };

  const handleDeselect = () => {
    setTimeout(() => {
      if (!isMoving) {
        setObj(null);
      }
    }, 100);
  };

  const handleMove = (e: any) => {
    const comp = comps.current[obj];

    if (!comp || !comp.style) {
      return;
    }

    const formatCss = (str: string) => {
      return Number(str.replace("px", ""));
    };

    comp.style.left = `${
      formatCss(comp.style.left) + (e.clientX - isMoving.clientX)
    }px`;
    comp.style.top = `${
      formatCss(comp.style.top) + (e.clientY - isMoving.clientY)
    }px`;

    isMoving.clientX = e.clientX;
    isMoving.clientY = e.clientY;
  };

  useEffect(() => {
    if (!!isMoving) {
      document.addEventListener("mousemove", handleMove);
    } else {
      document.removeEventListener("mousemove", handleMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMove);
    };
    //eslint-disable-next-line
  }, [isMoving]);

  return (
    <div
      onClick={handleDeselect}
      onMouseUp={handleStop}
      onMouseDown={(e) => handleClick(e)}
      className="border-zinc-800 w-full grow border relative overflow-hidden"
    >
      <Sidebar setObjects={setObjects} />
      {objects?.map((object, index) => {
        const Component = object.component;
        return (
          <div
            className={`border rounded p-4 select-none bg-black transition absolute ${
              obj === index ? "border-zinc-600" : "border-zinc-900"
            }`}
            style={{ left: object.x, top: object.y }}
            ref={(el: any) => (comps.current[index] = el)}
            key={index}
            onMouseDown={() => setObj(index)}
          >
            {<Component object={object} />}
          </div>
        );
      })}
      <button className="absolute bottom-4 right-4 border border-zinc-500 px-2 py-1 rounded transition hover:border-zinc-300">
        Executar
      </button>
      <svg className="absolute inset-0" ref={line}></svg>
    </div>
  );
};

export default Pipeline;
