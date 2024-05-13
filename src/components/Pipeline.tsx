"use client";

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import PipeIO from "./PipeIO";
import { PipeComponent, PipeComponentReq } from "@/utils/types/pipe_components";
import * as d3 from "d3";
import useObjectStore, { getObjects } from "@/store/objectsStore";
import useComponentsStore from "@/store/componentsStore";

type Props = {
  components: {
    name: string;
    config: any;
  }[];
};

const Pipeline = ({ components }: Props) => {
  const [isMoving, setIsMoving] = useState<any>(null);
  const [obj, setObj] = useState<number | any>(null);
  const [link, setLink] = useState<PipeComponent>();
  const [isLoading, setIsLoading] = useState(false);
  const comps = useRef<any>([]);
  const linksRef = useRef<any>([]);
  const [links, setLinks] = useState<string[][]>([]);

  const objects = getObjects();

  const setComponents = useComponentsStore((state) => state.setComponents);

  const { createLink, deleteObject, updatePos, copyObject, updateObjects } =
    useObjectStore((state) => state);

  useEffect(() => {
    setComponents(components);
    //eslint-disable-next-line
  }, [components]);

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

    const x = formatCss(comp.style.left) + (e.clientX - isMoving.clientX);
    const y = formatCss(comp.style.top) + (e.clientY - isMoving.clientY);

    comp.style.left = x + "px";
    comp.style.top = y + "px";

    updatePos(obj, x, y);

    // setObjects((objects) => [
    //   ...objects.filter((acObj) => acObj.id !== obj),
    //   object,
    // ]);
    // setPosition(object.id, object);

    isMoving.clientX = e.clientX;
    isMoving.clientY = e.clientY;

    buildLinks();
  };

  const buildLinks = (newLinks?: string[][]) => {
    let acLinks = links;

    if (newLinks) {
      acLinks = newLinks;
    }

    acLinks.forEach((link, index) => {
      const svg = d3.select(linksRef.current[index]);

      svg.selectAll("*").remove(); // Limpa o SVG

      const lineGenerator = d3.line().curve(d3.curveBasis);

      const x1 = Number(comps.current[link[0]].style.left.replace("px", ""));
      const y1 = Number(comps.current[link[0]].style.top.replace("px", ""));
      const x2 = Number(comps.current[link[1]].style.left.replace("px", ""));
      const y2 = Number(comps.current[link[1]].style.top.replace("px", ""));

      const pathData = lineGenerator([
        [x1, y1 + comps.current[link[0]].clientHeight - 15],
        [
          x1 + (x2 + comps.current[link[1]].clientWidth - x1) / 2,
          y1 + comps.current[link[0]].clientHeight - 15,
        ],
        [
          x2 +
            comps.current[link[1]].clientWidth -
            (x2 + comps.current[link[1]].clientWidth - x1) / 2,
          y2 + comps.current[link[1]].clientHeight - 15,
        ],
        [
          x2 + comps.current[link[1]].clientWidth,
          y2 + comps.current[link[1]].clientHeight - 15,
        ],
      ]);

      svg
        .append("path")
        .attr("d", pathData)
        .attr("fill", "none")
        .attr("stroke", "white");
    });
  };

  let lastKeyPressed = "";

  const handleKeyboard = (e: any) => {
    if (e.key === "Delete") {
      e.preventDefault();
      deleteObject(obj);
      setLinks((links) =>
        links.filter((link) => link[0] !== obj && link[1] !== obj)
      );
    }
    if (lastKeyPressed === "Control" && e.key === "d") {
      e.preventDefault();
      copyObject(obj);
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
        updateObjects(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLink = (obj: PipeComponent) => {
    if (link && link.output && obj.input.includes(link.output)) {
      createLink(obj.id, link.id);
      setLinks((links) => {
        setTimeout(() => {
          buildLinks([...links, [obj.id, link.id]]);
        });
        return [...links, [obj.id, link.id]];
      });
    }
  };

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
        <Sidebar />
        {objects?.map((object, index) => {
          if (object) {
            const Component = object.component;
            if (Component)
              return (
                <div
                  style={{
                    left: object.x + "px",
                    top: object.y + "px",
                    zIndex: object.z,
                  }}
                  key={object.id}
                  className={`border rounded select-none bg-black transition absolute z-0 text-sm ${
                    obj === object.id ? "border-zinc-500" : "border-zinc-900"
                  }`}
                  ref={(el: any) => (comps.current[object.id] = el)}
                >
                  <div className="p-4" onMouseDown={() => setObj(object.id)}>
                    <Component id={object.id} />
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
