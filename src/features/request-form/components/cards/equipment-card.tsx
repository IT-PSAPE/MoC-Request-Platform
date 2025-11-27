import Checkbox from "@/components/common/checkbox";
import { Card, CardContent, CardFooter } from "@/components/common/cards/public-card";
import Divider from "@/components/common/divider";

import Text from "@/components/common/text";
import Button from "@/components/common/button";
import { useFormContext } from "@/contexts/form-context";


export default function EquipmentCard({ equipment }: { equipment: Equipment }) {
  const { request, setRequest } = useFormContext();

  const checked = request.equipments.some((e) => e.id === equipment.id);

  function handleButtonClick() {
    setRequest((prev) => {
      return {
        ...prev,
        equipments: checked ? prev.equipments.filter((v) => v.id !== equipment.id) : [...prev.equipments, equipment]
      }
    })
  }

  return (
    <Card className="has-checked:border-brand has-checked:outline-2 has-checked:outline-border-brand/20">
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
        <Button className="w-full" variant="secondary" onClick={handleButtonClick} >{checked ? 'Remove' : 'Add'}  Venue</Button>
      </CardFooter>
    </Card>
  )
}