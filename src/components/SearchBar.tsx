import { Search } from "lucide-react";

interface ISearchBar {
  handleSearch: (e: any) => void;
  searchVal: string;
  searchLoading: boolean;
  placeholder: string;
  autoTrigger?: boolean;
}
const SearchBar = ({
  searchLoading,
  searchVal,
  handleSearch,
  placeholder,
}: ISearchBar) => {
  return (
    <div className="relative w-[25%]">
      <Search className="size-6 text-gray-500 absolute top-1.5 left-1" />
      {searchLoading && (
        <svg
          className="mr-3 size-7 animate-spin text-gray-500 rounded-4xl border-r-2 absolute right-0 top-1.5"
          viewBox="0 0 16 16"
        ></svg>
      )}

      <input
        type="text"
        className="rounded-3xl border outline-0 p-1.5 border-gray-500 indent-6 w-full bg-teal-50/30"
        value={searchVal}
        placeholder={placeholder}
        onChange={handleSearch}
      />
      
    </div>
  );
};

export default SearchBar;
