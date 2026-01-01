'use client';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { cn } from "@/shared/cn";
import { Icon } from "./icon";
import { SelectOptionItem } from "./select-option";

type SelectContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  value: string;
  setValue: (value: string) => void;
  highlightedIndex: number;
  setHighlightedIndex: Dispatch<SetStateAction<number>>;
  optionsRef: React.MutableRefObject<Map<number, HTMLDivElement>>;
  hasScrollUp: boolean;
  hasScrollDown: boolean;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
  dropdownRef: React.MutableRefObject<HTMLDivElement | null>;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
};

const SelectContext = createContext<SelectContextType | null>(null);

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) throw new Error("useSelectContext must be used within a Select provider");
  return context;
}

type UseSelectControllerParams = {
  value?: string;
  onValueChange?: (value: string) => void;
};

function useSelectController({
  value: controlledValue,
  onValueChange,
}: UseSelectControllerParams): SelectContextType {
  const [uncontrolledValue, setUncontrolledValue] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hasScrollUp, setHasScrollUp] = useState(false);
  const [hasScrollDown, setHasScrollDown] = useState(false);
  const optionsRef = useRef(new Map<number, HTMLDivElement>());
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue ?? "" : uncontrolledValue;

  const setValue = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
      setOpen(false);
    },
    [isControlled, onValueChange]
  );

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || dropdownRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      const options = Array.from(optionsRef.current.values());
      const optionCount = options.length;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) => (prev < optionCount - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : optionCount - 1));
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0) {
            optionsRef.current.get(highlightedIndex)?.click();
          }
          break;
        case "Escape":
          event.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, highlightedIndex]);

  useEffect(() => {
    if (highlightedIndex >= 0 && open) {
      optionsRef.current.get(highlightedIndex)?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, open]);

  useEffect(() => {
    if (open) {
      setHighlightedIndex(-1);
    }
  }, [open]);

  const checkScroll = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;
    const { scrollTop, scrollHeight, clientHeight } = content;
    setHasScrollUp(scrollTop > 10);
    setHasScrollDown(scrollTop < scrollHeight - clientHeight - 10);
  }, []);

  useEffect(() => {
    if (!open) return;
    checkScroll();
    const content = contentRef.current;
    content?.addEventListener("scroll", checkScroll);
    return () => content?.removeEventListener("scroll", checkScroll);
  }, [open, checkScroll]);

  return {
    open,
    setOpen,
    value,
    setValue,
    highlightedIndex,
    setHighlightedIndex,
    optionsRef,
    hasScrollUp,
    hasScrollDown,
    triggerRef,
    dropdownRef,
    contentRef,
  };
}

type ScrollIndicatorProps = {
  position: "top" | "bottom";
  onClick: () => void;
};

function ScrollIndicator({ position, onClick }: ScrollIndicatorProps) {
  return (
    <div
      className={cn(
        "absolute left-0 right-0 z-10 bg-primary py-1 cursor-pointer",
        position === "top" ? "top-0" : "bottom-0"
      )}
      onClick={onClick}
    >
      <Icon.chevron_down
        size={16}
        className={cn(
          "mx-auto text-gray-500",
          position === "top" && "rotate-180 animate-arrow-hint"
        )}
      />
    </div>
  );
}

type SelectTriggerProps = {
  placeholder: string;
  disabled?: boolean;
  displayValue?: string;
};

function SelectTrigger({ placeholder, disabled, displayValue }: SelectTriggerProps) {
  const { open, setOpen, value, triggerRef } = useSelectContext();
  const label = displayValue ?? (value || placeholder);
  const showPlaceholder = !value && !displayValue;

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      disabled={disabled}
      className={cn(
        "w-full px-3 py-2 bg-primary border border-primary rounded-lg shadow-sm paragraph-sm",
        "flex items-center justify-between",
        "hover:bg-secondary transition-colors",
        // "focus:outline-none focus:ring-2 focus:ring-brand-solid focus:ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      aria-expanded={open}
      aria-haspopup="listbox"
    >
      <span className={cn("truncate text-left", showPlaceholder && "text-gray-500")}>{label}</span>
      <Icon.chevron_down size={16} className="ml-2 text-gray-500" />
    </button>
  );
}

type SelectDropdownProps = {
  children: ReactNode;
};

function SelectDropdown({ children }: SelectDropdownProps) {
  const { dropdownRef, contentRef, hasScrollUp, hasScrollDown } = useSelectContext();
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">("bottom");
  const [maxHeight, setMaxHeight] = useState(240);

  useEffect(() => {
    const dropdown = dropdownRef.current;
    if (!dropdown) return;

    const rect = dropdown.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < 240 && spaceAbove > spaceBelow) {
      setDropdownPosition("top");
      setMaxHeight(Math.min(240, spaceAbove - 20));
    } else {
      setDropdownPosition("bottom");
      setMaxHeight(Math.min(240, spaceBelow - 20));
    }
  }, [dropdownRef]);

  const scrollToTop = () => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () =>
    contentRef.current?.scrollTo({ top: contentRef.current.scrollHeight, behavior: "smooth" });

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute z-50 min-w-full w-max mt-1",
        "bg-primary border border-primary rounded-lg shadow-lg",
        "animate-in fade-in-0 zoom-in-95",
        "overflow-hidden",
        dropdownPosition === "top" && "bottom-full mb-1 mt-0"
      )}
      style={{ maxHeight: `${maxHeight}px`, maxWidth: "320px" }}
      role="listbox"
    >
      <div className="relative h-full">
        {hasScrollUp && <ScrollIndicator position="top" onClick={scrollToTop} />}

        <div
          ref={contentRef}
          className="overflow-auto scrollbar-hide p-1"
          style={{ maxHeight: `${maxHeight}px` }}
        >
          <div>{children}</div>
        </div>

        {hasScrollDown && <ScrollIndicator position="bottom" onClick={scrollToBottom} />}
      </div>
    </div>
  );
}

type SelectOptionProps = {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
};

export function SelectOption({ value, children, disabled, className }: SelectOptionProps) {
  const { value: selectedValue, setValue, highlightedIndex, setHighlightedIndex, optionsRef } =
    useSelectContext();
  const optionRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(-1);

  const isSelected = selectedValue === value;
  const isHighlighted = highlightedIndex === index;

  useEffect(() => {
    const optionElement = optionRef.current;
    if (!optionElement) return;
    const optionsMap = optionsRef.current;
    const newIndex = optionsMap.size;
    setIndex(newIndex);
    optionsMap.set(newIndex, optionElement);

    return () => {
      optionsMap.delete(newIndex);
    };
  }, [optionsRef]);

  return (
    <div ref={optionRef}>
      <SelectOptionItem
        isSelected={isSelected}
        isHighlighted={isHighlighted}
        disabled={disabled}
        onClick={() => setValue(value)}
        onMouseEnter={() => setHighlightedIndex(index)}
        className={className}
      >
        {children}
      </SelectOptionItem>
    </div>
  );
}

type HiddenInputProps = {
  name: string;
  value: string;
};

function SelectHiddenInput({ name, value }: HiddenInputProps) {
  return <input type="hidden" name={name} value={value} />;
}

type SelectProps = {
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  name?: string;
  displayValue?: string;
};

export function Select({
  children,
  value: controlledValue,
  onValueChange,
  placeholder = "Select an option",
  className,
  disabled,
  name,
  displayValue,
}: SelectProps) {
  const controller = useSelectController({ value: controlledValue, onValueChange });

  return (
    <SelectContext.Provider value={controller}>
      <div className={cn("relative", className)}>
        <SelectTrigger placeholder={placeholder} disabled={disabled} displayValue={displayValue} />
        {controller.open && <SelectDropdown>{children}</SelectDropdown>}
        {name && <SelectHiddenInput name={name} value={controller.value} />}
      </div>
    </SelectContext.Provider>
  );
}