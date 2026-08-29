// OCEAN letter colors (same as oceanLetters in AboutClient)
const oceanColors: Record<string, string> = {
  O: "#a855f7",
  C: "#22c55e",
  E: "#f97316",
  A: "#ec4899",
  N: "#3b82f6",
};

interface SwipeOceanLogoProps {
  className?: string;
  suffix?: string; // e.g. "って？" for "Swipe Oceanって？"
}

export default function SwipeOceanLogo({ className = "", suffix }: SwipeOceanLogoProps) {
  return (
    <span className={className}>
      <span className="text-white">Swipe </span>
      {"OCEAN".split("").map((letter, i) => (
        <span key={i} style={{ color: oceanColors[letter] }}>
          {/* Display as "Ocean" (capitalized) not "OCEAN" */}
          {i === 0 ? letter : letter.toLowerCase()}
        </span>
      ))}
      {suffix && <span className="text-inherit">{suffix}</span>}
    </span>
  );
}
