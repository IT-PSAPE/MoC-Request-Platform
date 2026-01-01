import { useDefaultContext } from "@/components/contexts/defaults-context";
import { Button, Checkbox, TextInput, Text, Icon } from "@/components/ui";
import { Popover } from "@/components/ui/base/popover";
import { ScrollContainer } from "../../layout/scroll-container";
import { useFilterContext } from "./request-filter-provider";

function FilterContent() {

  const { closePopover } = Popover.useContext();
  const { pendingFilters, updatePendingFilter, applyFilters, resetFilters } = useFilterContext();
  const { types, priorities } = useDefaultContext();

  const handleDateChange = (field: "from" | "to", value: string) => {
    updatePendingFilter("dateRange", {
      ...pendingFilters.dateRange,
      [field]: value,
    });
  };

  const handleTypeToggle = (typeId: string) => {
    const isSelected = pendingFilters.requestTypes.includes(typeId);
    updatePendingFilter(
      "requestTypes",
      isSelected
        ? pendingFilters.requestTypes.filter(id => id !== typeId)
        : [...pendingFilters.requestTypes, typeId]
    );
  };

  const handlePriorityToggle = (priorityId: string) => {
    const isSelected = pendingFilters.priorities.includes(priorityId);
    updatePendingFilter(
      "priorities",
      isSelected
        ? pendingFilters.priorities.filter(id => id !== priorityId)
        : [...pendingFilters.priorities, priorityId]
    );
  };

  const handleShowArchivedToggle = () => {
    updatePendingFilter("showArchived", !pendingFilters.showArchived);
  };

  const handleApply = () => {
    applyFilters();
    closePopover();
  };

  const handleReset = () => {
    resetFilters();
  };

  return (
    <>
      <Popover.Header>
        <Text style="label-sm" className="font-medium">Filter</Text>
      </Popover.Header>

      <ScrollContainer className="max-h-full">
        <Popover.Body className="flex-1 space-y-4">

          {/* Due Date Range */}
          <Popover.Group fieldName="Due date range">
            <div>
              <Text style="paragraph-xs" className="text-primary/50 mb-1">From:</Text>
              <TextInput
                type="date"
                value={pendingFilters.dateRange.from}
                onChange={(e) => handleDateChange("from", e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <Text style="paragraph-xs" className="text-primary/50 mb-1">To:</Text>
              <TextInput
                type="date"
                value={pendingFilters.dateRange.to}
                onChange={(e) => handleDateChange("to", e.target.value)}
                className="text-xs"
              />
            </div>
          </Popover.Group>

          {/* Request Types */}
          <Popover.Group fieldName="Request Types">
            {types.map((type) => (
              <label key={type.id} className="flex items-center gap-2 cursor-pointer" >
                <Checkbox
                  checked={pendingFilters.requestTypes.includes(String(type.id))}
                  onChange={() => handleTypeToggle(String(type.id))}
                />
                <Text style="paragraph-sm" className="text-primary">
                  {type.name.replace(/_/g, " ")}
                </Text>
              </label>
            ))}
          </Popover.Group>

          {/* Request Priority */}
          <Popover.Group fieldName="Request Priority">
            {priorities.map((priority) => (
              <label key={priority.id} className="flex items-center gap-2 cursor-pointer" >
                <Checkbox
                  checked={pendingFilters.priorities.includes(String(priority.id))}
                  onChange={() => handlePriorityToggle(String(priority.id))}
                />
                <Text style="paragraph-sm" className="text-primary">
                  {priority.name.replace(/_/g, " ")}
                </Text>
              </label>
            ))}
          </Popover.Group>

          {/* Show Archived */}
          <Popover.Group fieldName="Archived Requests">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={pendingFilters.showArchived}
                onChange={handleShowArchivedToggle}
              />
              <Text style="paragraph-sm" className="text-primary">
                Show archived requests
              </Text>
            </label>
          </Popover.Group>
        </Popover.Body>
      </ScrollContainer>

      <Popover.Footer>
        <Button variant="secondary" size="sm" className="w-full" onClick={handleReset}>
          Reset all
        </Button>
        <Button variant="primary" size="sm" className="w-full" onClick={handleApply}>
          Apply now
        </Button>
      </Popover.Footer>
    </>
  );
}

export function FilterPopover() {
  return (
    <Popover.Provider>
      <Popover.Root>
        <Popover.Trigger className="mobile:w-full">
          <Button variant="secondary" className="space-x-1 mobile:w-full">
            <Icon.filter size={16} />
            <span>Filter</span>
          </Button>
        </Popover.Trigger>

        <Popover.Content position={'bottom-right'} maxWidth="280px" maxHeight="480px" className="flex flex-col h-200">
          <FilterContent />
        </Popover.Content>
      </Popover.Root>
    </Popover.Provider>
  )
}
