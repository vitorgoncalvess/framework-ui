import JsonVizualizerComp from "@/components/pipe_components/JsonVizualizer";
import RequisicaoComp from "@/components/pipe_components/Request";
import { Component } from "../models/components";
import Value from "@/components/pipe_components/Value";
import Plus from "@/components/pipe_components/Plus";

export type PipeComponent = {
  id: string;
  x: string;
  y: string;
  component: ({ object }: { object: PipeComponent }) => React.JSX.Element;
  data: any;
  type_action: "SEND_DATA_TO" | "RENDER";
  action?: () => any;
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
        id: comp.id,
        x: "300px",
        y: "60px",
        callback: null,
        isLinkedWith: "",
        links: [],
        data: null,
        type_action: "",
        input: [],
        output: "",
        ...obj,
      };
    };
    switch (comp.id.toLowerCase()) {
      case "req": {
        return createObj({
          component: RequisicaoComp,
          data: {
            url: "",
            status: 0,
            response: null,
          },
          type_action: "SEND_DATA",
          action: async function () {
            try {
              const response = await fetch(this.data.url);
              if (response.ok) {
                this.data.status = response.status;
                this.data.response = await response.json();
              }
            } catch (err) {
              console.log(err);
            }
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
        return createObj({ component: Value, type_action: "SEND_DATA" });
      }
      case "plus": {
        return createObj({ component: Plus, type_action: "SUM" });
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
