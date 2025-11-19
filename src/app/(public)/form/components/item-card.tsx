import Checkbox from "@/components/common/checkbox";
import { Card, CardContent } from "@/components/common/cards/public-card";
import Divider from "@/components/common/divider";

import Text from "@/components/common/text";
import { useFormContext } from "@/contexts/form-context";
import NumberInput from "@/components/common/forms/number-input";


export default function RequestItemCard({ item }: { item: RequestItem }) {
  const { request, setRequest } = useFormContext();

  const checked = request.items.some((i) => i.id === item.id);

  const currentItem = request.items.find((i) => i.id === item.id);

  function handleCardClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();

    console.log('Card clicked:', item.id, 'Current item:', currentItem);

    setRequest((prev) => {
      return {
        ...prev,
        items: checked 
          ? prev.items.filter((v) => v.id !== item.id) 
          : [...prev.items, { id: item.id, quantity: 1 }]
      }
    })
  }

  function handleCheckboxClick(event: React.ChangeEvent<HTMLInputElement>) {
    event.stopPropagation();

    setRequest((prev) => {
      return {
        ...prev,
        items: checked 
          ? prev.items.filter((v) => v.id !== item.id) 
          : [...prev.items, { id: item.id, quantity: 1 }]
      }
    })
  }

  function onValueChange(value: number) {
    console.log('Item card value change:', item.id, value);

    setRequest((prev) => {
      return {
        ...prev,
        items: prev.items.map((i) => {
          if (i.id === item.id) {
            return { ...i, quantity: value };
          }
          return i;
        })
      }
    })
  }

  console.log('Current item:', currentItem);

  return (
    <Card className="has-checked:border-brand cursor-pointer">
      <CardContent>
        <div className="flex items-center gap-2" >
          <Checkbox checked={checked} onChange={handleCheckboxClick} />
          <Text style="label-md">{item.name}</Text>
          {/* <Text style="paragraph-sm">Left: {item.available}</Text> */}
        </div>
        <Divider className="py-3" />
        <Text style="paragraph-sm" className="text-quaternary whitespace-pre-line">{item.description}</Text>
        <NumberInput value={currentItem?.quantity || 1} onChange={onValueChange} className="mt-2" />
      </CardContent>
    </Card>
  )
}