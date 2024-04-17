"use client";

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import PipeIO from "./PipeIO";
import { PipeComponent } from "@/utils/factories/componentFactory";

const Pipeline = () => {
  const [objects, setObjects] = useState<PipeComponent[]>([]);
  const [isMoving, setIsMoving] = useState<any>(null);
  const [obj, setObj] = useState<number | any>(null);
  const comps = useRef<any>([]);
  const [link, setLink] = useState<PipeComponent>();
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const ws = new WebSocket("ws://localhost:8000/echo");
  //   ws.addEventListener("message", (data) => {
  //     console.log(data);
  //   });
  // }, []);

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

  const handleExec = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api", {
        method: "POST",
        body: JSON.stringify(objects),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        handleUpdate(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (data: any[]) => {
    data.forEach((obj) => {
      const comp = objects.find((acObj) => acObj.id === obj.id);
      if (comp) {
        comp.data = obj.data;
        if (comp.callback) comp?.callback();
      }
    });
  };

  const handleLink = (obj: PipeComponent) => {
    if (link && obj.input.includes(link.output)) {
      link.links.push(obj.id);
      obj.isLinkedWith = link.id;
    }
  };

  return (
    <div
      onClick={handleDeselect}
      onMouseUp={handleStop}
      onMouseDown={(e) => handleClick(e)}
      className="border-zinc-800 w-full grow border relative overflow-hidden bg-grid-pattern bg-repeat"
    >
      <Sidebar setObjects={setObjects} />
      {objects?.map((object, index) => {
        const Component = object.component;
        return (
          <div
            style={{ left: object.x, top: object.y }}
            className={`border rounded select-none bg-black transition absolute text-sm hover:border-zinc-600 ${
              obj === index ? "border-zinc-600" : "border-zinc-900"
            }`}
            key={index}
            ref={(el: any) => (comps.current[index] = el)}
          >
            <div className="p-4" onMouseDown={() => setObj(index)}>
              {<Component object={object} />}
            </div>
            <div className={`w-full relative`}>
              {object.input.length > 0 && (
                <PipeIO
                  onMouseUp={() => handleLink(object)}
                  key={index}
                  io={object.input}
                  input
                />
              )}
              {object.output && (
                <PipeIO
                  onMouseDown={() => setLink(object)}
                  io={object.output}
                />
              )}
            </div>
          </div>
        );
      })}
      <button
        disabled={isLoading}
        onClick={handleExec}
        className="absolute disabled:opacity-50 bottom-4 right-4 border border-zinc-500 px-2 py-1 rounded transition hover:border-zinc-300"
      >
        Executar
      </button>
    </div>
  );
};

export default Pipeline;
