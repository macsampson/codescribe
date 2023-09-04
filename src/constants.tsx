import { Bars2Icon, Bars4Icon } from "@heroicons/react/24/outline";
import gpt4SVG from "@src/assets/img/gpt4.svg";
import gpt3SVG from "@src/assets/img/gpt35turbo.svg";

export const title = "CodeScribe for GitHub";
export const modelSelectLabel = "Model Selection";
export const detailSelectLabel = "Response Detail";
export const explainCodeButtonLabel = "Explain Code";

export const detailOptions = [
  { id: 1, label: "Concise", value: "concise", icon: <Bars2Icon /> },
  { id: 2, label: "Detailed", value: "detailed", icon: <Bars4Icon /> },
  // Add other detail options as needed
];

export const modelOptions = [
  {
    id: 1,
    label: "GPT-3.5 Turbo",
    value: "gpt-3.5-turbo",
    icon: <img src={gpt3SVG} alt="gpt-3.5-turbo" />,
  },
  {
    id: 2,
    label: "GPT-4",
    value: "gpt-4",
    icon: <img src={gpt4SVG} alt="gpt-4" />,
  },
];
