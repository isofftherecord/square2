export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      width="26"
      height="14"
      viewBox="0 0 26 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className={className}
      aria-hidden="true"
    >
      <path d="M0 7h24" strokeLinecap="round" />
      <path d="M18 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
