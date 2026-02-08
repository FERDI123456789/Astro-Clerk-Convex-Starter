import React from "react"; // optional but ensures JSX types

export function highlightText(text: string, search: string) {
  if (!search) return text; // No search, return normal text

  const regex = new RegExp(
    `(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);

  return parts.map((part, idx) =>
    regex.test(part) ? (
      <span key={idx} className="bg-blue-200">
        {part}
      </span>
    ) : (
      <span key={idx}>{part}</span>
    ),
  );
}
