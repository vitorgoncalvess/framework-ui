import React, { HTMLAttributes, useState } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  io: string | string[];
  input?: boolean;
};

const PipeIO = ({ io, input, ...props }: Props) => {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [time, setTime] = useState<NodeJS.Timeout>();

  const handleOver = () => {
    clearInterval(time);
    setTime(
      setTimeout(() => {
        setOpen(true);
      }, 750)
    );
  };

  const close = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const handleOut = () => {
    clearInterval(time);
    setTime(
      setTimeout(() => {
        close();
      }, 750)
    );
  };

  return (
    <div {...props} className="relative">
      <div
        onMouseOver={handleOver}
        onMouseOut={handleOut}
        className={`bg-zinc-800 h-4 w-4 hover:bg-zinc-300 rounded-full bottom-2 absolute ${
          input ? "-left-2" : "-right-2"
        }`}
      ></div>
      {open && (
        <div
          className={`bg-zinc-950 border border-zinc-700 opacity-90 rounded flex animate-tooltip-enter ${
            isClosing && "animate-tooltip-out"
          } flex-col gap-2 p-4 absolute -bottom-4 text-xs font-medium ${
            input ? "right-[calc(100%+30px)]" : "left-[calc(100%+30px)]"
          }`}
        >
          {Array.isArray(io) ? (
            io.map((io) => <h1 key={io}>{io}</h1>)
          ) : (
            <h1>{io}</h1>
          )}
        </div>
      )}
    </div>
  );
};

export default PipeIO;
