import { useEffect } from "react"; // Remove if unused after this

interface SearchInputProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
}

export default function SearchInput({
  search,
  setSearch,
  placeholder = "Search…",
}: SearchInputProps) {
  return (
    <div className="relative pr-2 w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className="w-full shadow-sm text-black rounded-lg pl-12 pr-4 py-3 focus:bg-gray-100 focus:outline-none focus:shadow-none transition-all duration-300"
      />
      <svg
        className="absolute left-4 inset-y-0 my-auto h-5 w-5 text-black"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
