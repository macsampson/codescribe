import React from "react";

interface SvgProps {
  className?: string;
  onClick?: () => void;
  title?: string;
}

const ClearIcon: React.FC<SvgProps> = ({ className, onClick, title }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      fill="none"
    >
      <title>{title}</title>
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M9 9L15 15"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke="currentColor"
        ></path>{" "}
        <path
          d="M15 9L9 15"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke="currentColor"
        ></path>{" "}
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke="currentColor"
        ></circle>{" "}
      </g>
    </svg>
  );
};

export default ClearIcon;
