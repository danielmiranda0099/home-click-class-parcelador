export function RescheduleIcon({
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
      {/* Arrow loop */}
      <path d="M21 8C19.5 5 17 3 12 3C7 3 3 7 3 12C3 17 7 21 12 21C17 21 21 17 21 12" />
      <polyline points="21 3 21 8 16 8" />

      {/* Clock */}
      <circle cx="12" cy="12" r="6" />
      <polyline points="12 8 12 12 14 14" />
    </svg>
  );
}
