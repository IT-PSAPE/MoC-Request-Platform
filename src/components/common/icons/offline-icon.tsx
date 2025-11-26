export default function OfflineIcon() {
  return (
    <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
      <svg
        className="w-12 h-12 text-tertiary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 5.636l-1.061 1.061M5.636 18.364l1.061-1.061M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M7.05 7.05L5.636 5.636M18.364 18.364L16.95 16.95"
        />
      </svg>
    </div>
  );
}
