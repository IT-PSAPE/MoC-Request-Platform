'use client';

import { useState, useEffect } from "react";
import { cn } from "@/shared/cn";
import { TextInput } from "@/components/ui";
import { SelectOptionContainer, SelectOptionItem } from "@/components/ui/common/select-option";
import { Popover } from "@/components/ui/base/popover";

type SelectOption = {
  id: string;
  name: string;
  color?: string;
};

type InlineEditPopoverProps = {
  value: string;
  displayValue?: string;
  onSave: (newValue: string) => Promise<void> | void;
  type: 'text' | 'select' | 'date';
  options?: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  position?: 'bottom-left' | 'bottom-right' | 'bottom-center';
  children: React.ReactNode; // The display component (badge, text, etc.)
};

function InlineEditPopoverContent({
  value,
  onSave,
  type,
  options = [],
  placeholder = "Click to edit",
}: {
  value: string;
  onSave: (newValue: string) => Promise<void> | void;
  type: 'text' | 'select' | 'date';
  options?: SelectOption[];
  placeholder?: string;
}) {
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const { close } = Popover.useContext();

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = async (newValue: string) => {
    if (newValue === value) {
      close();
      return;
    }

    setIsLoading(true);
    try {
      await onSave(newValue);
      close(); // Close popover after successful save
    } catch (error) {
      console.error('Failed to save:', error);
      setEditValue(value); // Revert on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = async (optionId: string) => {
    await handleSave(optionId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave(editValue);
    } else if (e.key === 'Escape') {
      setEditValue(value);
      close();
    }
  };

  const renderEditContent = () => {
    if (type === 'select') {
      return (
        <SelectOptionContainer maxHeight={200}>
          {options.map((option) => (
            <SelectOptionItem
              key={option.id}
              isSelected={value === option.id}
              onClick={() => handleSelectOption(option.id)}
            >
              {option.name}
            </SelectOptionItem>
          ))}
        </SelectOptionContainer>
      );
    }

    if (type === 'text') {
      return (
        <div className="p-3">
          <TextInput
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => handleSave(editValue)}
            placeholder={placeholder}
            autoFocus
            disabled={isLoading}
            className="w-full"
          />
        </div>
      );
    }

    return null;
  };

  return renderEditContent();
}

export function InlineEditPopover({
  value,
  onSave,
  type,
  options = [],
  placeholder = "Click to edit",
  className,
  disabled = false,
  position = 'bottom-left',
  children,
}: InlineEditPopoverProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
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

      <Popover.Content position={position} maxWidth="240px">
        <InlineEditPopoverContent
          value={value}
          onSave={onSave}
          type={type}
          options={options}
          placeholder={placeholder}
        />
      </Popover.Content>
    </Popover.Root>
  );
}
