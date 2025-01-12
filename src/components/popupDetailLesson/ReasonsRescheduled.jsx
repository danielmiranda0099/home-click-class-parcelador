export function ReasonsRescheduled({ reason = "" }) {
  const parts = reason.split(/(\$%|\$&)/);
  return (
    <>
      {parts.map((part, index) => {
        if (part === "$%") {
          return (
            <p key={index} className="text-base font-medium mt-1">
              {parts[index + 1]}
            </p>
          );
        } else if (part === "$&") {
          return (
            <p key={index} className="text-sm mb-1 text-muted-foreground">
              {parts[index + 1]}
            </p>
          );
        } else {
          return null;
        }
      })}
    </>
  );
}
