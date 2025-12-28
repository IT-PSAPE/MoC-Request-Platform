import { useFilterContext } from "./filter-provider";
import Button from "../controls/button";
import Radio from "../controls/radio";
import Text from "../text";
import { Popover } from "@/components/ui/base/popover";

export function SortPopover() {
  const { closePopover } = Popover.useContext();
  const { pendingSort, updatePendingSort, applySort, resetSort } = useFilterContext();

  const handleFieldChange = (field: "name" | "dueDate" | "createDate" | "type") => {
    updatePendingSort("field", field);
  };

  const handleDirectionChange = (direction: "asc" | "desc") => {
    updatePendingSort("direction", direction);
  };

  const handleApply = () => {
    applySort();
    closePopover();
  };

  const handleReset = () => {
    resetSort();
  };

  function sortName(field: "name" | "dueDate" | "createDate" | "type", direction: "asc" | "desc") {
    handleFieldChange(field);
    handleDirectionChange(direction);
  }

  return (
    <>
      <Popover.Header>
        <Text style="label-sm" className="font-medium">Sort by</Text>
      </Popover.Header>

      <Popover.Body className="space-y-4">
        {/* Name */}
        <Popover.Group fieldName="Name">
          <Radio
            name="name-sort"
            value="name-asc"
            label="A-Z"
            checked={pendingSort.field === "name" && pendingSort.direction === "asc"}
            onChange={() => sortName("name", "asc")}
          />
          <Radio
            name="name-sort"
            value="name-desc"
            label="Z-A"
            checked={pendingSort.field === "name" && pendingSort.direction === "desc"}
            onChange={() => sortName("name", "desc")}
          />
        </Popover.Group>


        {/* Due Date */}
        <Popover.Group fieldName="Due date">
          <Radio
            name="duedate-sort"
            value="duedate-asc"
            label="Ascending"
            checked={pendingSort.field === "dueDate" && pendingSort.direction === "asc"}
            onChange={() => sortName("dueDate", "asc")}
          />
          <Radio
            name="duedate-sort"
            value="duedate-desc"
            label="Descending"
            checked={pendingSort.field === "dueDate" && pendingSort.direction === "desc"}
            onChange={() => sortName("dueDate", "desc")}
          />
        </Popover.Group>

        {/* Create Date */}
        <Popover.Group fieldName="Create date">
          <Radio
            name="createdate-sort"
            value="createdate-asc"
            label="Ascending"
            checked={pendingSort.field === "createDate" && pendingSort.direction === "asc"}
            onChange={() => { sortName("createDate", "asc"); handleDirectionChange("asc"); }}
          />
          <Radio
            name="createdate-sort"
            value="createdate-desc"
            label="Descending"
            checked={pendingSort.field === "createDate" && pendingSort.direction === "desc"}
            onChange={() => { sortName("createDate", "desc"); handleDirectionChange("desc"); }}
          />
        </Popover.Group>

        {/* Type */}
        <Popover.Group fieldName="Type">
          <Radio
            name="type-sort"
            value="type-asc"
            label="A-Z"
            checked={pendingSort.field === "type" && pendingSort.direction === "asc"}
            onChange={() => {
              handleFieldChange("type");
              handleDirectionChange("asc");
            }}
          />
          <Radio
            name="type-sort"
            value="type-desc"
            label="Z-A"
            checked={pendingSort.field === "type" && pendingSort.direction === "desc"}
            onChange={() => {
              handleFieldChange("type");
              handleDirectionChange("desc");
            }}
          />
        </Popover.Group>
      </Popover.Body>

      <Popover.Footer>
        <Button variant="secondary" size="sm" className="w-full" onClick={handleReset} >
          Reset all
        </Button>
        <Button variant="primary" size="sm" className="w-full" onClick={handleApply} >
          Apply now
        </Button>
      </Popover.Footer>
    </>
  );
}
