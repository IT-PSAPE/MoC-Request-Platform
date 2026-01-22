'use client';

import { Icon, Text } from "@/components/ui/common";
import InlineEditor from "@/components/ui/block/inline-editor/inline-editor";
import { useDefaultContext } from "@/components/contexts/defaults-context";
import {
  statusColorMap,
  priorityColorMap,
  requestColorMap,
  formatDate,
  formatPriority,
  formatRequestType,
  type RequestDetailsEditableProps
} from "../request.utils";
import RequestAssignees from "./request-assignees";


type PropertyItemProp = {
  icon: React.ReactNode,
  label: string,
  children: React.ReactNode
}

function PropertyItem({ icon, label, children }: PropertyItemProp) {
  return (
    <div className="w-full gap-sm grid grid-cols-2">
      <span className="flex items-center gap-1.5 h-8">
        {icon}
        <Text style="label-sm" className="text-secondary">{label}</Text>
      </span>
      <span className="flex items-center gap-1.5 min-h-8">
        {children}
      </span>
    </div>
  )
}

export default function RequestDetailsOverview({
  request,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateType,
  onUpdateDueDate,
  onAssignMember,
  onUnassignMember,
}: RequestDetailsEditableProps) {
  const { statuses, priorities, types } = useDefaultContext();

  return (
    <section className="space-y-5">
      <Text style="title-h6">{request.what || "Untitled Request"}</Text>
      <div className="space-y-1">
        <PropertyItem icon={<Icon.status size={16} />} label="Status">
          <InlineEditor
            value={request.status.id}
            displayValue={request.status.name}
            onSave={(newStatusId) => onUpdateStatus?.(request.id, newStatusId)}
            type="select"
            options={statuses.map(status => ({ id: status.id, name: status.name }))}
            displayComponent="badge"
            badgeColor={statusColorMap[request.status.name] || "gray"}
            disabled={!onUpdateStatus || statuses.length === 0}
            className="w-fit"
            position="bottom-right"
          />
        </PropertyItem>
        <PropertyItem icon={<Icon.dropdown size={16} />} label="Priority">
          <InlineEditor
            value={request.priority.id}
            displayValue={formatPriority(request.priority)}
            onSave={(newPriorityId) => onUpdatePriority?.(request.id, newPriorityId)}
            type="select"
            options={priorities.map(priority => ({ id: priority.id, name: priority.name }))}
            displayComponent="badge"
            badgeColor={priorityColorMap[request.priority.name] || "gray"}
            disabled={!onUpdatePriority || priorities.length === 0}
            className="w-fit"
            position="bottom-right"
          />

        </PropertyItem>
        <PropertyItem icon={<Icon.tag size={16} />} label="Type">
          <InlineEditor
            value={request.type.id}
            displayValue={formatRequestType(request.type)}
            onSave={(newTypeId) => onUpdateType?.(request.id, newTypeId)}
            type="select"
            options={types.map(type => ({ id: type.id, name: type.name }))}
            displayComponent="badge"
            badgeColor={requestColorMap[request.type.name] || "gray"}
            disabled={!onUpdateType || types.length === 0}
            className="w-fit"
            position="bottom-right"
          />
        </PropertyItem>
        <PropertyItem icon={<Icon.calendar size={16} />} label="Due Date">
          <InlineEditor
            value={request.due || ''}
            displayValue={formatDate(request.due)}
            onSave={(newDueDate) => onUpdateDueDate?.(request.id, newDueDate)}
            type="date"
            placeholder="Set due date"
            disabled={!onUpdateDueDate}
            position="bottom-right"
          />
        </PropertyItem>
        <PropertyItem icon={<Icon.clock_rewind size={16} />} label="Created time">
          <Text style="paragraph-sm" className="text-tertiary">
            {formatDate(request.created_at)}
          </Text>
        </PropertyItem>
        <PropertyItem icon={<Icon.user size={16} />} label="Assigned Members">
          <RequestAssignees
            request={request}
            onAssignMember={onAssignMember}
            onUnassignMember={onUnassignMember}
          />
        </PropertyItem>
      </div>
    </section>
  );
}

