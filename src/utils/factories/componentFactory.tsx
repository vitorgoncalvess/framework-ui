import JsonVizualizerComp from "@/components/pipe_components/JsonVizualizer";
import RequisicaoComp from "@/components/pipe_components/Request";
import { Component } from "../models/components";
import Value from "@/components/pipe_components/Value";
import Plus from "@/components/pipe_components/Plus";

export type PipeComponent = {
  id: string;
  type: string;
  x: string;
  y: string;
  component: ({ object }: { object: PipeComponent }) => React.JSX.Element;
  data: any;
  callback: null | ((data?: any) => any);
  isLinkedWith: string;
  links: string[];
  input: string[];
  output: string;
};

const componentFactory = () => {
  const createNewComponent = (comp: Component): PipeComponent => {
    const createObj = (obj: any) => {
      return {
        id: `${Math.random().toString().replace(".", "")}`,
        type: comp.id,
        x: "300px",
        y: "60px",
        component: null,
        callback: null,
        isLinkedWith: null,
        links: [],
        data: null,
        input: [],
        output: null,
        ...obj,
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
          output: "REQUEST",
        });
      }
      case "json-vizualizer": {
        return createObj({
          component: JsonVizualizerComp,
          type_action: "RENDER",
          input: ["REQUEST", "JSON"],
        });
      }
      case "value": {
        return createObj({
          component: Value,
          type_action: "SEND_DATA",
          output: "VALUE",
        });
      }
      case "plus": {
        return createObj({
          component: Plus,
          type_action: "SUM",
          input: ["VALUE"],
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
