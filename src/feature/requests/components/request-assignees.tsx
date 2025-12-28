'use client';

import AssigneeInlineEditor from "@/components/ui/block/inline-editor/assignee-inline-editor";
import { useAdminContext } from "@/components/contexts/admin-context";
import { type RequestDetailsEditableProps } from "../request.utils";

export default function RequestAssignees({
  request,
  onAssignMember,
  onUnassignMember,
}: RequestDetailsEditableProps) {
  const { members } = useAdminContext();

  // Convert assignees to the format expected by the inline editor
  const assignees = request.assignee.map(a => ({
    id: a.member_id,
    name: a.member.name
  }));

  // Get unassigned members
  const assignedMemberIds = request.assignee.map(a => a.member_id);
  const availableMembers = members.filter(member => !assignedMemberIds.includes(member.id)).map(m => ({
    id: m.id,
    name: m.name
  }));

  const handleAssignMultiple = async (selectedMemberIds: string[]) => {
    if (!onAssignMember) return;

    // Assign each selected member
    for (const memberId of selectedMemberIds) {
      try {
        await onAssignMember(request.id, memberId);
      } catch (error) {
        console.error(`Failed to assign member ${memberId}:`, error);
        throw error; // Re-throw to stop the process and show error to user
      }
    }
  };

  const handleUnassign = async (memberId: string) => {
    if (!onUnassignMember) return;

    try {
      await onUnassignMember(request.id, memberId);
    } catch (error) {
      console.error("Failed to unassign member:", error);
    }
  };

  return (
    <AssigneeInlineEditor
      assignees={assignees}
      availableMembers={availableMembers}
      onSave={handleAssignMultiple}
      onRemoveAssignee={handleUnassign}
      disabled={!onAssignMember && !onUnassignMember}
      position="bottom-right"
      className="w-full"
    />
  );
}
