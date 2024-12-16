export function PaperSearchIcon({
  size = 24,
  color = "currentColor",
  className = "",
  ...props
}) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 4C4 2.89543 4.89543 2 6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" />
      <path d="M14 2V8H20" />
      <circle cx="11" cy="14" r="4" />
      <path d="M15.5 18.5L18 21" />
    </svg>
  );
}
