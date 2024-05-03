"use client";

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import PipeIO from "./PipeIO";
import {
  PipeComponent,
  PipeComponentReq,
} from "@/utils/factories/componentFactory";
import * as d3 from "d3";

const Pipeline = () => {
  const [objects, setObjects] = useState<PipeComponent[]>([]);
  const [isMoving, setIsMoving] = useState<any>(null);
  const [obj, setObj] = useState<number | any>(null);
  const [link, setLink] = useState<PipeComponent>();
  const [isLoading, setIsLoading] = useState(false);
  const comps = useRef<any>([]);
  const linksRef = useRef<any>([]);
  const [links, setLinks] = useState<string[][]>([]);
  const [lastKey, setLastKey] = useState("");

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

    const object = objects.find((acObj) => acObj.id === obj);

    if (object) {
      object.x = formatCss(comp.style.left) + (e.clientX - isMoving.clientX);
      object.y = formatCss(comp.style.top) + (e.clientY - isMoving.clientY);
      setObjects((objects) => [
        ...objects.filter((acObj) => acObj.id !== obj),
        object,
      ]);
    }

    isMoving.clientX = e.clientX;
    isMoving.clientY = e.clientY;
  };

  let lastKeyPressed = "";

  const handleKeyboard = (e: any) => {
    setLastKey(e.key);
    if (e.key === "Delete") {
      e.preventDefault();
      setObjects((objects) => objects.filter((acObj) => acObj.id !== obj));
      setLinks((links) =>
        links.filter((link) => link[0] !== obj && link[1] !== obj)
      );
    }
    if (lastKeyPressed === "Control" && e.key === "d") {
      e.preventDefault();
      const object = { ...objects.find((acObj) => acObj.id === obj) };
      if (Object.keys(object).length) {
        object.id = `${Math.random().toString().replace(".", "")}`;
        //@ts-ignore
        object.x = object.x + 20;
        //@ts-ignore
        object.y = object.y + 20;
        //@ts-ignore
        setObjects((objects) => [...objects, object]);
      }
    }
    lastKeyPressed = e.key;
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboard);

    if (!!isMoving) {
      document.addEventListener("mousemove", handleMove);
    } else {
      document.removeEventListener("mousemove", handleMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("keydown", handleKeyboard);
    };
    //eslint-disable-next-line
  }, [isMoving]);

  const getNode = (obj: PipeComponent): PipeComponentReq => {
    const childNodes: string[] = [];
    obj.childNodes.forEach((val) => childNodes.push(val));
    let is_root = false;
    if (!obj.output && obj.childNodes.size > 0) {
      is_root = true;
    }
    return {
      id: obj.id,
      childNodes,
      is_root,
      data: obj.data,
    };
  };

  const handleExec = async () => {
    setIsLoading(true);
    let nodes: PipeComponentReq[] = [];
    objects.forEach((obj) => {
      if ((!obj.output && obj.childNodes.size > 0) || obj.hasParents) {
        nodes.push(getNode(obj));
      }
    });
    try {
      const response = await fetch("http://localhost:8000/api", {
        method: "POST",
        body: JSON.stringify(nodes),
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
        if (typeof obj.data === "object") {
          comp.data = { ...comp.data, ...obj.data };
        } else {
          comp.data = obj.data;
        }
        if (comp.callback) comp.callback();
      }
    });
  };

  const handleLink = (obj: PipeComponent) => {
    if (link && link.output && obj.input.includes(link.output)) {
      obj.childNodes.add(link.id);
      link.hasParents = true;
      setLinks((links) => [...links, [obj.id, link.id]]);
    }
  };

  useEffect(() => {
    links.forEach((link, index) => {
      const svg = d3.select(linksRef.current[index]);

      svg.selectAll("*").remove(); // Limpa o SVG

      const lineGenerator = d3.line().curve(d3.curveBasis);

      const pathData = lineGenerator([
        [
          comps.current[link[0]].offsetLeft,
          comps.current[link[0]].offsetTop +
            comps.current[link[0]].clientHeight -
            15,
        ],
        [
          comps.current[link[0]].offsetLeft +
            (comps.current[link[1]].offsetLeft +
              comps.current[link[1]].clientWidth -
              comps.current[link[0]].offsetLeft) /
              2,
          comps.current[link[0]].offsetTop +
            comps.current[link[0]].clientHeight -
            15,
        ],
        [
          comps.current[link[1]].offsetLeft +
            comps.current[link[1]].clientWidth -
            (comps.current[link[1]].offsetLeft +
              comps.current[link[1]].clientWidth -
              comps.current[link[0]].offsetLeft) /
              2,
          comps.current[link[1]].offsetTop +
            comps.current[link[1]].clientHeight -
            15,
        ],
        [
          comps.current[link[1]].offsetLeft +
            comps.current[link[1]].clientWidth,
          comps.current[link[1]].offsetTop +
            comps.current[link[1]].clientHeight -
            15,
        ],
      ]);

      svg
        .append("path")
        .attr("d", pathData)
        .attr("fill", "none")
        .attr("stroke", "white");
    });
  }, [objects, links]);

  return (
    <div
      onClick={handleDeselect}
      onMouseUp={handleStop}
      onMouseDown={(e) => handleClick(e)}
      className={`border-zinc-800 w-full grow border relative flex items-center justify-center ${
        isLoading && "overflow-hidden"
      }`}
    >
      {isLoading ? (
        <div className="absolute w-[300%] h-[300%] spin bg-[conic-gradient(white,transparent,transparent,transparent)]"></div>
      ) : (
        <div className="absolute w-full h-full bg-white animate-in shadow-[0_0_18px_-9px_rgba(255,255,255,1)]"></div>
      )}
      <div className="absolute w-[calc(100%-2px)] h-[calc(100%-2px)] bg-grid-pattern bg-black z-10 overflow-hidden">
        <svg width="100%" height="100%">
          {links.map((_, index) => (
            <g key={index} ref={(el) => (linksRef.current[index] = el)}></g>
          ))}
        </svg>
        <Sidebar setObjects={setObjects} />
        {objects?.map((object, index) => {
          if (object) {
            const Component = object.component;
            if (Component)
              return (
                <div
                  style={{ left: object.x + "px", top: object.y + "px" }}
                  className={`border rounded select-none bg-black transition absolute z-50 text-sm ${
                    obj === object.id ? "border-zinc-500" : "border-zinc-900"
                  }`}
                  key={index}
                  ref={(el: any) => (comps.current[object.id] = el)}
                >
                  <div className="p-4" onMouseDown={() => setObj(object.id)}>
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
          }
        })}
        <button
          id="teste"
          disabled={isLoading}
          onClick={handleExec}
          className="absolute disabled:opacity-50 bottom-4 right-4 border border-zinc-500 px-2 py-1 rounded transition hover:border-zinc-300"
        >
          Executar
        </button>
      </div>
    </div>
  );
};

export default Pipeline;
