import MainContent from "@/components/layout/main-content";
import NavigationBar from "@/components/navigation-bar";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <NavigationBar />
            <main className="w-full overflow-clip h-full min-h-0">
                <MainContent>
                    {children}
                </MainContent>
            </main>
        </>
    );
}