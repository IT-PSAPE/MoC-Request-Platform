'use client';

import Text from "@/components/common/text";
import Icon from "@/components/common/icon";
import InlineEditor from "@/components/common/inline-editor";
import { useDefaultContext } from "@/contexts/defaults-context";
import {
  statusColorMap,
  priorityColorMap,
  requestColorMap,
  formatDate,
  formatPriority,
  formatRequestType,
  type RequestDetailsEditableProps
} from "../shared/request-details-utils";
import RequestAssignees from "./request-assignees";

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
      <div className="space-y-4 *:w-full *:gap-sm *:grid *:grid-cols-2 *:items-center">
        <div>
          <span className="flex items-center gap-1.5">
            <Icon name="line:status" size={16} />
            <Text style="label-sm" className="text-secondary">Status</Text>
          </span>
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
        </div>
        <div>
          <span className="flex items-center gap-1.5">
            <Icon name="line:dropdown" size={16} />
            <Text style="label-sm" className="text-secondary">Priority</Text>
          </span>
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
        </div>
        <div>
          <span className="flex items-center gap-1.5">
            <Icon name="line:tag" size={16} />
            <Text style="label-sm" className="text-secondary">Type</Text>
          </span>
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
        </div>
        <div>
          <span className="flex items-center gap-1.5">
            <Icon name="line:calendar" size={16} />
            <Text style="label-sm" className="text-tertiary">Due Date</Text>
          </span>
          <InlineEditor
            value={request.due || ''}
            displayValue={formatDate(request.due)}
            onSave={(newDueDate) => onUpdateDueDate?.(request.id, newDueDate)}
            type="date"
            placeholder="Set due date"
            disabled={!onUpdateDueDate}
            position="bottom-right"
          />
        </div>
        <div>
          <span className="flex items-center gap-1.5">
            <Icon name="line:clock_rewind" size={16} />
            <Text style="label-sm" className="text-secondary">Created time</Text>
          </span>
          <div className="px-1 py-0.5 min-h-[24px] flex items-center">
            <Text style="paragraph-sm" className="text-tertiary">
              {formatDate(request.created_at)}
            </Text>
          </div>
        </div>
        <div>
          <span className="flex items-center gap-1.5">
            <Icon name="line:user" size={16} />
            <Text style="label-sm" className="text-secondary">Assigned Members</Text>
          </span>
          <div className="px-1 py-0.5 min-h-[24px] flex items-center">
            <RequestAssignees
              request={request}
              onAssignMember={onAssignMember}
              onUnassignMember={onUnassignMember}
            />
          </div>
        </div>
      </div>

      {/* Assignees Section */}
      {/* <div className="space-y-2">
        <span className="flex items-center gap-1.5">
          <Icon name="line:user" size={16} />
          <Text style="label-sm" className="text-secondary">Assigned Members</Text>
        </span>
        <RequestAssignees
          request={request}
          onAssignMember={onAssignMember}
          onUnassignMember={onUnassignMember}
        />
      </div> */}
    </section>
  );
}

