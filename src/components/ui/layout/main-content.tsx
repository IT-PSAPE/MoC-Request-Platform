import { ScrollContainer } from "./scroll-container";

function MainContent({ children }: { children?: React.ReactNode }) {
    return (
        <div className="p-2 mobile:p-0 flex-1 overflow-y-auto h-full min-h-0 hide-scrollbar">
            <ScrollContainer className="flex flex-col bg-primary border border-secondary mobile:border-0 rounded-xl mobile:rounded-none w-full h-full overflow-auto">
                {children}
            </ScrollContainer>
        </div>
    );
}

export default MainContent;