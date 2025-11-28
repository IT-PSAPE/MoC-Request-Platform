'use client';

import { useState } from "react";
import { cn } from "@/lib/cn";
import Text from "./text";
import Badge from "./badge";
import Button from "./button";
import Icon from "./icon";
import { Popover } from "./popover/popover";
import { SelectOptionItem } from "./select-option";

type AssigneeOption = {
  id: string;
  name: string;
};

type AssigneeInlineEditorProps = {
  assignees: AssigneeOption[];
  availableMembers: AssigneeOption[];
  onSave: (selectedMemberIds: string[]) => Promise<void> | void;
  className?: string;
  disabled?: boolean;
  position?: 'bottom-left' | 'bottom-right' | 'bottom-center';
  onRemoveAssignee?: (memberId: string) => Promise<void> | void;
};

function AssigneeInlineEditorContent({
  assignees,
  availableMembers,
  onSave,
  onRemoveAssignee,
}: {
  assignees: AssigneeOption[];
  availableMembers: AssigneeOption[];
  onSave: (selectedMemberIds: string[]) => Promise<void> | void;
  onRemoveAssignee?: (memberId: string) => Promise<void> | void;
}) {
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { closePopover } = Popover.useContext();

  const handleMemberToggle = (memberId: string) => {
    setSelectedMemberIds(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSave = async () => {
    if (selectedMemberIds.length === 0) {
      closePopover();
      return;
    }

    setIsLoading(true);
    try {
      await onSave(selectedMemberIds);
      setSelectedMemberIds([]); // Clear selection after save
      closePopover();
    } catch (error) {
      console.error('Failed to save assignees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedMemberIds([]);
    closePopover();
  };

  const handleRemove = async (memberId: string) => {
    if (!onRemoveAssignee) return;
    
    try {
      await onRemoveAssignee(memberId);
    } catch (error) {
      console.error('Failed to remove assignee:', error);
    }
  };

  return (
    <div className="w-80">
      {/* Current Assignees */}
      {assignees.length > 0 && (
        <div className="p-3 pb-2">
          <Text style="label-sm" className="text-secondary mb-2">Currently Assigned</Text>
          <div className="flex flex-wrap gap-1">
            {assignees.map((assignee) => (
              <Badge 
                key={assignee.id} 
                className="flex items-center gap-1 pr-1"
              >
                <span>{assignee.name}</span>
                {onRemoveAssignee && (
                  <span 
                    onClick={() => handleRemove(assignee.id)} 
                    className="cursor-pointer hover:bg-white/20 rounded p-0.5"
                  >
                    <Icon name="line:close" size={12} />
                  </span>
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Available Members to Add */}
      {availableMembers.length > 0 && (
        <div className="pb-2">
          <div className="px-3 py-2 pb-2">
            <Text style="label-sm" className="text-secondary">Add Members</Text>
          </div>
          <div className="relative">
            <div className="max-h-48 overflow-y-auto">
              <div className="px-1">
                {availableMembers.map((member) => (
                  <SelectOptionItem
                    key={member.id}
                    isSelected={selectedMemberIds.includes(member.id)}
                    onClick={() => handleMemberToggle(member.id)}
                    className="mx-2 my-0.5"
                  >
                    {member.name}
                  </SelectOptionItem>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No available members message */}
      {availableMembers.length === 0 && assignees.length > 0 && (
        <div className="p-3">
          <Text style="paragraph-sm" className="text-tertiary">
            All available members are assigned
          </Text>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 p-3 border-t border-secondary">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          variant="primary"
          onClick={handleSave}
          disabled={selectedMemberIds.length === 0 || isLoading}
          className="flex-1"
        >
          {isLoading ? "Saving..." : `Add ${selectedMemberIds.length || ''}`}
        </Button>
      </div>
    </div>
  );
}

export default function AssigneeInlineEditor({
  assignees,
  availableMembers,
  onSave,
  className,
  disabled = false,
  position = 'bottom-right',
  onRemoveAssignee,
}: AssigneeInlineEditorProps) {
  const [isHovered, setIsHovered] = useState(false);

  const renderDisplayComponent = () => {
    if (assignees.length === 0) {
      return (
        <div className="flex items-center gap-1.5 px-1 py-0.5 min-h-[24px] w-full">
          <Text style="paragraph-sm" className="text-tertiary italic">
            No members assigned
          </Text>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {assignees.map((assignee) => (
          <Badge 
            key={assignee.id} 
            className="flex items-center gap-1 pr-1"
          >
            <span>{assignee.name}</span>
            {onRemoveAssignee && (
              <span 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveAssignee(assignee.id);
                }} 
                className="cursor-pointer hover:bg-white/20 rounded p-0.5"
              >
                <Icon name="line:close" size={12} />
              </span>
            )}
          </Badge>
        ))}
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
            {renderDisplayComponent()}
          </div>
        </Popover.Trigger>
        
        <Popover.Content position={position}>
          <AssigneeInlineEditorContent
            assignees={assignees}
            availableMembers={availableMembers}
            onSave={onSave}
            onRemoveAssignee={onRemoveAssignee}
          />
        </Popover.Content>
      </Popover.Root>
    </Popover.Provider>
  );
}
