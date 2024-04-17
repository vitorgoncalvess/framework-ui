import { PipeComponent } from "@/utils/factories/componentFactory";
import React from "react";

type Props = {
  object: PipeComponent;
};

const Request = ({ object, ...props }: Props) => {
  return (
    <div {...props} className="flex flex-col gap-4">
      <header className="flex gap-2">
        <select
          className="bg-transparent border p-2 border-zinc-900 font-medium rounded"
          name=""
          id=""
        >
          <option value="">GET</option>
          <option value="">POST</option>
          <option value="">DELETE</option>
        </select>
        <input
          onChange={({ target }) => (object.data.url = target.value)}
          placeholder="http://localhost:3000"
          className="rounded-sm bg-black border border-zinc-900 p-2"
          type="text"
        />
      </header>
    </div>
  );
};

export default Request;
