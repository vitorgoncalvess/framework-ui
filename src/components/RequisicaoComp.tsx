import React from "react";

const RequisicaoComp = () => {
  return (
    <div className="flex flex-col gap-4">
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
          placeholder="http://localhost:3000"
          className="rounded-sm bg-black border border-zinc-900 p-2"
          type="text"
        />
      </header>
    </div>
  );
};

export default RequisicaoComp;
