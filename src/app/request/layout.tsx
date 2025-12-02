import MainContent from "@/components/layout/main-content";
import NavigationBar from "@/components/navigation/navigation-bar";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <NavigationBar />
            {/* <main className="w-full overflow-clip h-full min-h-0"> */}
            <main className="w-full overflow-y-auto h-full min-h-0 max-md:overflow-auto max-md:h-fit">
                <MainContent>
                    {children}
                </MainContent>
            </main>
        </>
    );
}