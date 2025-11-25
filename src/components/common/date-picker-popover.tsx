'use client';

import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import { Popover } from "./popover/popover";
import Input from "./forms/input";
import Button from "./button";
import Text from "./text";

type DatePickerPopoverProps = {
  value: string;
  displayValue?: string;
  onSave: (newValue: string) => Promise<void> | void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  position?: 'bottom-left' | 'bottom-right' | 'bottom-center';
  children: React.ReactNode; // The display component (text, badge, etc.)
};

function DatePickerPopoverContent({
  value,
  onSave,
  placeholder = "Set date",
}: {
  value: string;
  onSave: (newValue: string) => Promise<void> | void;
  placeholder?: string;
}) {
  const [editValue, setEditValue] = useState(() => {
    if (!value) return '';
    try {
      // Convert to YYYY-MM-DDTHH:mm format for datetime-local input
      return new Date(value).toISOString().slice(0, 16);
    } catch {
      return '';
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const { closePopover } = Popover.useContext();

  useEffect(() => {
    if (!value) {
      setEditValue('');
      return;
    }
    try {
      setEditValue(new Date(value).toISOString().slice(0, 16));
    } catch {
      setEditValue('');
    }
  }, [value]);

  const handleSave = async (newValue: string | null) => {
    // Convert back to ISO string if we have a date, or null for clear
    const dateValue = newValue ? new Date(newValue).toISOString() : null;
    
    if (dateValue === value) {
      closePopover();
      return;
    }

    setIsLoading(true);
    try {
      await onSave(dateValue || '');
      closePopover(); // Close popover after successful save
    } catch (error) {
      console.error('Failed to save:', error);
      // Revert on error
      if (!value) {
        setEditValue('');
      } else {
        try {
          setEditValue(new Date(value).toISOString().slice(0, 16));
        } catch {
          setEditValue('');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    setEditValue('');
    await handleSave(null);
  };

  const handleNow = async () => {
    const now = new Date().toISOString().slice(0, 16);
    setEditValue(now);
    await handleSave(now);
  };

  return (
    <div className="p-3 space-y-3">
      <div>
        <Text style="label-sm" className="text-secondary mb-2">Select Date & Time</Text>
        <Input
          type="datetime-local"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => handleSave(editValue)}
          placeholder={placeholder}
          autoFocus
          disabled={isLoading}
          className="w-full"
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleNow}
          disabled={isLoading}
          className="flex-1"
        >
          Now
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleClear}
          disabled={isLoading}
          className="flex-1"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

export function DatePickerPopover({
  value,
  onSave,
  placeholder = "Set date",
  className,
  disabled = false,
  position = 'bottom-left',
  children,
}: DatePickerPopoverProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Popover.Provider>
      <Popover.Root>
        <Popover.Trigger className={className}>
          <div
            className={cn(
              "cursor-pointer rounded-md transition-all duration-150",
              isHovered && "bg-secondary/50"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {children}
          </div>
        </Popover.Trigger>
        
        <Popover.Content position={position} maxWidth="280px">
          <DatePickerPopoverContent
            value={value}
            onSave={onSave}
            placeholder={placeholder}
          />
        </Popover.Content>
      </Popover.Root>
    </Popover.Provider>
  );
}
