function MainContent({ children }: { children?: React.ReactNode }) {
    return (
        <div className="p-2 flex-1 overflow-y-auto h-full min-h-0 hide-scrollbar">
            <div className="flex flex-col bg-primary border border-secondary rounded-xl w-full h-full overflow-auto">
                {children}
            </div>
        </div>
    );
}

export default MainContent;