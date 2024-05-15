"use server";

import { promises } from "fs";

export default async function getComponents() {
  const names = await promises.readdir("src/components/pipe_components");

  return await Promise.all(
    names.map(async (name) => {
      const { config } = await import("@/components/pipe_components/" + name);

      return {
        name,
        config,
      };
    })
  );
}
