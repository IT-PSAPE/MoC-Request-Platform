import Checkbox from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/public-card";
import Divider from "./divider";

import Text from "@/components/ui/text";
import Button from "@/components/ui/Button";


export default function RequestItemCard({ item, checked }: { item: RequestItem, checked: boolean }) {
  return (
    <Card className="has-checked:border-brand">
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
        <Button className="w-full" variant="secondary" >Add Equipment</Button>
      </CardFooter>
    </Card>
  )
}