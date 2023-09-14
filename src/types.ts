export interface githubCodeResponse {
  code: string;
  fileName: string;
  url: string;
}

export interface Option {
  id: number;
  label: string;
  icon?: JSX.Element; // This is just a guess; update it to your needs.
}

export type ModelType = {
  id: number;
  label: string;
  value: string;
  icon: JSX.Element;
};

export type DetailLevelType = {
  id: number;
  label: string;
  value: string;
  icon: JSX.Element;
};
