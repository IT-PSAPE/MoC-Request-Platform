import Checkbox from "@/components/common/controls/checkbox";
import { Card, CardContent } from "@/components/common/cards/public-card";
import Divider from "@/components/common/divider";

import Text from "@/components/common/text";
import { useFormContext } from "@/components/contexts/form-context";


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
    <Card className="has-checked:border-brand cursor-pointer" onClick={handleCardClick}>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}