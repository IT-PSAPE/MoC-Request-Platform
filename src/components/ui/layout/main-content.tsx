import { ScrollContainer } from "./scroll-container";

function MainContent({ children }: { children?: React.ReactNode }) {
    return (
        <ScrollContainer className="flex flex-col w-full h-full overflow-auto">
            {children}
        </ScrollContainer>
    );
}

export default MainContent;