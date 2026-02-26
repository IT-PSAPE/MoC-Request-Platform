'use client';

import { cn } from "@/shared/cn";
import { Text } from "@/components/ui/common/text";
import { Badge } from "@/components/ui/common/badge";
import { InlineEditPopover } from "./inline-edit-popover";
import { DatePickerPopover } from "@/components/ui/block/date-picker-popover";

type InlineEditorProps = {
  value: string;
  displayValue?: string;
  onSave: (newValue: string) => Promise<void> | void;
  type?: 'text' | 'select' | 'date';
  options?: Array<{ id: string; name: string; color?: string }>;
  placeholder?: string;
  className?: string;
  displayComponent?: 'text' | 'badge';
  badgeColor?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  position?: 'bottom-left' | 'bottom-right' | 'bottom-center';
};

export default function InlineEditor({
  value,
  displayValue,
  onSave,
  type = 'text',
  options = [],
  placeholder = "Click to edit",
  className,
  displayComponent = 'text',
  badgeColor,
  disabled = false,
  icon,
  position = 'bottom-left',
}: InlineEditorProps) {
  const displayText = displayValue || value || placeholder;

  const renderDisplayComponent = () => {
    if (displayComponent === 'badge') {
      return (
        <Badge
          className="w-fit"
          color={badgeColor as React.ComponentProps<typeof Badge>['color']}
        >
          {displayText}
        </Badge>
      );
    }

    return (
      <div className="flex items-center gap-1.5 px-1 py-0.5 min-h-[24px]">
        {icon && <span className="shrink-0">{icon}</span>}
        <Text style="paragraph-sm" className={cn(
          disabled ? "text-tertiary" : "text-primary",
          !value && !displayValue && "text-tertiary italic"
        )}>
          {displayText}
        </Text>
      </div>
    );
  };

  if (disabled) {
    return (
      <div className={className}>
        {renderDisplayComponent()}
      </div>
    );
  }

  if (type === 'date') {
    return (
      <DatePickerPopover
        value={value}
        displayValue={displayValue}
        onSave={onSave}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        position={position}
      >
        {renderDisplayComponent()}
      </DatePickerPopover>
    );
  }

  return (
    <InlineEditPopover
      value={value}
      displayValue={displayValue}
      onSave={onSave}
      type={type}
      options={options}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      position={position}
    >
      {renderDisplayComponent()}
    </InlineEditPopover>
  );
}
