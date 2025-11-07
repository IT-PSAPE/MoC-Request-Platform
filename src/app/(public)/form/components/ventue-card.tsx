import Checkbox from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/public-card";
import Divider from "@/components/ui/divider";

import Text from "@/components/ui/text";
import Button from "@/components/ui/Button";
import { useFormContext } from "../form-provider";


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