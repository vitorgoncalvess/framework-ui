"use client";

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";

const Pipeline = () => {
  const [objects, setObjects] = useState<any[]>([]);
  const [isMoving, setIsMoving] = useState<any>(null);
  const [obj, setObj] = useState<any>(null);
  const comps = useRef<any>([]);

  const handleClick = (e: any, index: number) => {
    setObj(index);
    setIsMoving(e);
  };

  const handleStop = () => {
    setIsMoving(null);
    setObj(null);
  };

  const handleMove = (e: any) => {
    const comp = comps.current[obj];

    if (!comp || !comp.style) {
      console.error("Componente ou estilo do componente não encontrado");
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
  }, [isMoving]);

  return (
    <div
      onMouseUp={handleStop}
      className="border-zinc-800 w-full grow border relative overflow-hidden"
    >
      <Sidebar setObjects={setObjects} />
      {objects?.map((obj, index) => (
        <div
          className="border border-zinc-900 rounded p-4 select-none bg-black transition absolute"
          style={{ left: obj.x, top: obj.y }}
          ref={(el: any) => (comps.current[index] = el)}
          key={index}
          onMouseDown={(e) => handleClick(e, index)}
        >
          {obj.component}
        </div>
      ))}
    </div>
  );
};

export default Pipeline;
