import ObjectVizualizer from "@/components/pipe_components/ObjectVizualizer";
import RequisicaoComp from "@/components/pipe_components/Request";
import { Component } from "../models/components";
import Value from "@/components/pipe_components/Value";
import Plus from "@/components/pipe_components/Plus";
import ObjectMapper from "@/components/pipe_components/ObjectMapper";

export type PipeComponent = {
  id: string;
  x: number;
  y: number;
  component:
    | (({ object }: { object: PipeComponent }) => React.JSX.Element)
    | null;
  data: {
    type: string;
  } & any;
  callback: null | ((data?: any) => any);
  childNodes: Set<string>;
  hasParents: boolean;
  input: string[];
  output: string | null;
};

type ParsePipeComponent = {
  [Property in keyof PipeComponent]?: PipeComponent[Property];
};

export type PipeComponentReq = {
  id: string;
  data: any;
  is_root: boolean;
  childNodes: string[];
};

const componentFactory = () => {
  const createNewComponent = (comp: Component): PipeComponent => {
    const createObj = (obj: ParsePipeComponent): PipeComponent => {
      return {
        id: `${Math.random().toString().replace(".", "")}`,
        x: 300,
        y: 60,
        component: null,
        callback: null,
        childNodes: new Set(),
        hasParents: false,
        input: [],
        output: null,
        ...obj,
        data: {
          type: comp.id,
          ...obj.data,
        },
      };
    };
    switch (comp.id.toLowerCase()) {
      case "req": {
        return createObj({
          component: RequisicaoComp,
          data: {
            url: "",
            method: "GET",
            headers: {},
          },
          output: "RESPONSE",
        });
      }
      case "json-vizualizer": {
        return createObj({
          component: ObjectVizualizer,
          input: ["RESPONSE", "OBJECT"],
        });
      }
      case "object": {
        return createObj({
          component: Value,
          output: "VALUE",
          data: {
            value: null,
          },
        });
      }
      case "plus": {
        return createObj({
          component: Plus,
          data: {
            value: 0,
          },
          input: ["VALUE"],
        });
      }
      case "object-mapper": {
        return createObj({
          component: ObjectMapper,
          data: {
            keys: [],
            selectedKeys: [],
          },
          input: ["OBJECT", "RESPONSE"],
          output: "OBJECT",
        });
      }
      default: {
        return createObj({});
      }
    }
  };

  return {
    createNewComponent,
  };
};

export default componentFactory;
