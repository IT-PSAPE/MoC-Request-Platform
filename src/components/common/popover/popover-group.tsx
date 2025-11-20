import Text from "../text";

type PopoverGroupProps = {
  fieldName: string;
  children: React.ReactNode;
};

function PopoverGroup({ fieldName, children }: PopoverGroupProps) {
  return (
    <div className="space-y-2">
      <Text style="label-xs" className="text-foreground/70">{fieldName}</Text>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

export { PopoverGroup }