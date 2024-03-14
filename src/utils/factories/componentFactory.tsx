import JsonVizualizerComp from "@/components/JsonVizualizerComp";
import RequisicaoComp from "@/components/RequisicaoComp";
import { Component } from "../models/components";

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
};

const componentFactory = () => {
  const createNewComponent = (comp: Component): PipeComponent | undefined => {
    switch (comp.id.toLowerCase()) {
      case "req": {
        return {
          id: comp.id,
          x: "45px",
          y: "45px",
          component: RequisicaoComp,
          data: {
            url: "",
            status: 0,
            response: null,
          },
          type_action: "SEND_DATA_TO",
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
          callback: null,
          isLinkedWith: "",
          links: [],
        };
      }
      case "json-vizualizer": {
        return {
          id: comp.id,
          x: "45px",
          y: "45px",
          component: JsonVizualizerComp,
          data: {},
          type_action: "RENDER",
          callback: null,
          isLinkedWith: "",
          links: [],
        };
      }
    }
  };

  return {
    createNewComponent,
  };
};

export default componentFactory;
