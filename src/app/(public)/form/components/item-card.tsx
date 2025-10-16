import Checkbox from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/public-card";
import Divider from "@/components/ui/divider";

import Text from "@/components/ui/text";
import Button from "@/components/ui/Button";
import { useFormContext } from "../form-provider";


export default function RequestItemCard({ item }: { item: RequestItem }) {
  const { request, setRequest } = useFormContext();

  const checked = request.items.some((i) => i.id === item.id);

  function handleButtonClick() {
    console.log(item);

    setRequest((prev) => {
      return {
        ...prev,
        items: checked ? prev.items.filter((v) => v.id !== item.id) : [...prev.items, item]
      }
    })
  }

  return (
    <Card className="has-checked:border-brand has-checked:outline-2 has-checked:outline-border-brand/20">
      <CardContent>
        <div className="flex items-center gap-2" >
          <Checkbox checked={checked} />
          <Text style="label-md">{item.name}</Text>
        </div>
        <div className="py-3">
          <Divider />
        </div>
        <div className="line-clamp-3">
          <Text style="paragraph-sm" className="text-quaternary">{item.description}</Text>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="secondary" onClick={handleButtonClick} >{checked ? 'Remove' : 'Add'}  Equipment</Button>
      </CardFooter>
    </Card>
  )
}