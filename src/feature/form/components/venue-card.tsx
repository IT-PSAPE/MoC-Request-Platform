import { useFormContext } from "@/feature/form/components/form-context";
import { Checkbox, Divider, PublicCard, PublicCardContent, Text } from "@/components/ui";

export default function VenueCard({ venue }: { venue: Venue }) {
  const { request, setRequest } = useFormContext();

  const checked = request.venues.some((v) => v.id === venue.id);

  function handleCardClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();

    setRequest((prev) => {
      return {
        ...prev,
        venues: checked ? prev.venues.filter((v) => v.id !== venue.id) : [...prev.venues, venue]
      }
    })
  }

  return (
    <PublicCard className="has-checked:border-brand cursor-pointer" onClick={handleCardClick}>
      <PublicCardContent>
        <div className="flex items-center gap-2" >
          <Checkbox checked={checked} />
          <Text style="label-md">{venue.name}</Text>
        </div>
        <div className="py-3">
          <Divider />
        </div>
        <div className="line-clamp-3">
          <Text style="paragraph-sm" className="text-quaternary">{venue.description}</Text>
        </div>
      </PublicCardContent>
    </PublicCard>
  )
}