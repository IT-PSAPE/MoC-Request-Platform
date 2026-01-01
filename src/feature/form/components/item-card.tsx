import { PublicCard, PublicCardContent } from "@/components/ui/common/public-card";
import { Checkbox, Divider, Text } from "@/components/ui";
import { useFormContext } from "@/feature/form/components/form-context";


export default function RequestItemCard({ item }: { item: RequestItem }) {
  const { request, setRequest } = useFormContext();

  const checked = request.items.some((i) => i.id === item.id);

  function handleCardClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();

    setRequest((prev) => {
      return {
        ...prev,
        items: checked ? prev.items.filter((v) => v.id !== item.id) : [...prev.items, item]
      }
    })
  }

  return (
    <PublicCard className="has-checked:border-brand cursor-pointer" onClick={handleCardClick}>
      <PublicCardContent>
        <div className="flex items-center gap-2" >
          <Checkbox checked={checked} />
          <Text style="label-md">{item.name}</Text>
          {/* <Text style="paragraph-sm">Left: {item.name}</Text> */}
        </div>
        <div className="py-3">
          <Divider />
        </div>
        <div className="line-clamp-3">
          <Text style="paragraph-sm" className="text-quaternary">{item.description}</Text>
        </div>
      </PublicCardContent>
    </PublicCard>
  )
}