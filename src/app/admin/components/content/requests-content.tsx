import Text from "@/components/ui/text";
import EmptyState from "@/components/ui/EmptyState";
import Header from "../../components/header";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "@/components/ui/sheet/sheet";
import Button from "@/components/ui/Button";

export default function RequestsContent() {
    return (
        <>
            <Header>
                <Text style="title">Requests</Text>
                <Text style="body">Supporting Text</Text>
            </Header>
            <div className="p-6" >
                <EmptyState message="No requests available" />
                <Sheet>
                    <SheetTrigger>
                        <Button>Open Sheet</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <Text style="title">Are you absolutely sure?</Text>
                            <Text style="caption">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</Text>
                        </SheetHeader>
                        <div className="flex-1">
                            {/* Content */}
                        </div>
                        <SheetFooter className="flex justify-end gap-3">
                            <SheetClose className="w-full">
                                <Button className="w-full" variant="secondary">Cancel</Button>
                            </SheetClose>
                            <Button className="w-full">Save Changes</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}