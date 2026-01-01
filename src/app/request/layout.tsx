"use client";

import MainContent from "@/components/ui/layout/main-content";
import NavigationBar from "@/components/navigation/navigation-bar";
import Link from "next/link";
import { Icon, IconButton } from "@/components/ui";
import { RequestContextProvider } from "@/feature/requests/components/request-context";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <RequestContextProvider>
            <NavigationTop />
            {/* <main className="w-full overflow-clip h-full min-h-0"> */}
            <main className="w-full overflow-y-auto h-full min-h-0 max-md:overflow-auto max-md:h-fit">
                <MainContent>
                    {children}
                </MainContent>
            </main>
        </RequestContextProvider>
    );
}

function NavigationTop() {
    const router = useRouter();

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/board");
        }
    };

    return (
        <div className="px-margin py-4 sticky top-0 bg-gradient-to-b from-primary to-primary/0 z-10">
            <div className="flex justify-between items-center">
                <div className="bg-primary border border-gray-200 rounded-full">
                    <IconButton variant="ghost" onClick={handleBack}>
                        <Icon.arrow_left size={20} />
                    </IconButton>
                </div>
                <div className="bg-primary border border-gray-200 rounded-full px-1 spacer-x-1">
                    <IconButton variant="ghost">
                        <Icon.pen_line size={20} />
                    </IconButton>
                    <IconButton variant="ghost">
                        <Icon.archive size={20} />
                    </IconButton>
                    <IconButton variant="ghost">
                        <Icon.trash size={20} />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}