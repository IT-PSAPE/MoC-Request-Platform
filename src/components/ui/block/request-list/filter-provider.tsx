'use client';

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type FilterState = {
  dateRange: {
    from: string;
    to: string;
  };
  requestTypes: string[];
  priorities: string[];
};

type SortState = {
  field: "name" | "dueDate" | "createDate" | "type";
  direction: "asc" | "desc";
};

type FilterContextValue = {
  // Filter state
  filters: FilterState;
  pendingFilters: FilterState;
  updatePendingFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  
  // Sort state  
  sort: SortState;
  pendingSort: SortState;
  updatePendingSort: <K extends keyof SortState>(key: K, value: SortState[K]) => void;
  applySort: () => void;
  resetSort: () => void;
};

interface FilterProviderProps {
  children: ReactNode;
}

const defaultFilterState: FilterState = {
  dateRange: { from: "", to: "" },
  requestTypes: [],
  priorities: [],
};

const defaultSortState: SortState = {
  field: "createDate",
  direction: "desc",
};

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterContext must be used within FilterProvider");
  }
  return context;
}

export function FilterProvider({ children }: FilterProviderProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [pendingFilters, setPendingFilters] = useState<FilterState>(defaultFilterState);
  const [sort, setSort] = useState<SortState>(defaultSortState);
  const [pendingSort, setPendingSort] = useState<SortState>(defaultSortState);

  const updatePendingFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setPendingFilters(prev => ({ ...prev, [key]: value }));
  };

  const updatePendingSort = <K extends keyof SortState>(key: K, value: SortState[K]) => {
    setPendingSort(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(pendingFilters);
  };

  const resetFilters = () => {
    const resetState = defaultFilterState;
    setFilters(resetState);
    setPendingFilters(resetState);
  };

  const applySort = () => {
    setSort(pendingSort);
  };

  const resetSort = () => {
    const resetState = defaultSortState;
    setSort(resetState);
    setPendingSort(resetState);
  };

  const hasActiveFilters = 
    filters.dateRange.from !== "" ||
    filters.dateRange.to !== "" ||
    filters.requestTypes.length > 0 ||
    filters.priorities.length > 0;

  const value: FilterContextValue = {
    filters,
    pendingFilters,
    updatePendingFilter,
    applyFilters,
    resetFilters,
    hasActiveFilters,
    sort,
    pendingSort,
    updatePendingSort,
    applySort,
    resetSort,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}
