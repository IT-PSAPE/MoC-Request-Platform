import Checkbox from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/public-card";
import Divider from "./divider";

import Text from "@/components/ui/text";
import Button from "@/components/ui/Button";


export default function EquipmentCard({ equipment, checked }: { equipment: Equipment, checked: boolean }) {
  return (
    <Card className="has-checked:border-brand">
      <CardContent>
        <div className="flex items-center gap-2" >
          <Checkbox checked={checked} />
          <Text style="label-md">{equipment.name}</Text>
        </div>
        <div className="py-3">
          <Divider />
        </div>
        <div className="line-clamp-3">
          <Text style="paragraph-sm" className="text-quaternary">{equipment.description}</Text>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="secondary" >Add Venue</Button>
      </CardFooter>
    </Card>
  )
}