import { IconProps } from "@/types/icons";

export const Scale = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}: IconProps) => (
  <svg
    fill="none"
    height={size || height || 24}
    width={size || width || 24}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7ZM18 6 6 18"
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="M18 10V6h-4M6 14v4h4"
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);
