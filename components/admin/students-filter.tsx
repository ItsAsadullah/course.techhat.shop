"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function StudentsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentGender = searchParams.get("gender") || "all";
  const currentStatus = searchParams.get("status") || "all";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const setFilter = (key: string, value: string) => {
    router.push(`?${createQueryString(key, value)}`);
  };

  const hasFilters = currentGender !== "all" || currentStatus !== "all";

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("gender");
    params.delete("status");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`h-9 text-xs rounded-xl border-slate-200 font-semibold shadow-sm ${hasFilters ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
            <Filter className="w-3.5 h-3.5 mr-2" />
            Filters {hasFilters && <span className="ml-1 flex h-2 w-2 rounded-full bg-indigo-600"></span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Filter by Gender</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={currentGender} onValueChange={(val) => setFilter("gender", val)}>
            <DropdownMenuRadioItem value="all">All Genders</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="male">Male</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="female">Female</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={currentStatus} onValueChange={(val) => setFilter("status", val)}>
            <DropdownMenuRadioItem value="all">All Statuses</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="inactive">Inactive</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {hasFilters && (
        <Button onClick={clearFilters} variant="ghost" className="h-9 px-2 text-xs text-slate-500 hover:text-slate-800">
          <X className="w-3.5 h-3.5 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
