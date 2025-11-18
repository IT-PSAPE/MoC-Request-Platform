function MainContent({ children }: { children?: React.ReactNode }) {
    return (
        <div className="p-2 max-md:p-0 flex-1 overflow-y-auto h-full min-h-0 hide-scrollbar">
            <div className="flex flex-col bg-primary border border-secondary max-md:border-0 rounded-xl max-md:rounded-none w-full h-full overflow-auto max-md:h-fit">
                {children}
            </div>
        </div>
    );
}

export default MainContent;