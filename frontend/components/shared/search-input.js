"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const SearchInput = () => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentCategoryId = searchParams.get("categoryId");

  return (
    <div className="flex-1 flex justify-center items-center max-w-2xl mx-auto">
      <div className="relative w-full">
        <Search className="w-5 h-5 absolute top-3 left-4 text-slate-600" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full pl-12 pr-4 py-2 h-12 rounded-full bg-slate-100 dark:bg-slate-800/50 focus-visible:ring-slate-200 text-lg"
          placeholder="Search for a course"
        />
      </div>
    </div>
  );
};

export default SearchInput;