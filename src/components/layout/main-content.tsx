function MainContent({ children }: { children?: React.ReactNode }) {
    return (
        <div className="p-2 flex-1" >
            <div className="bg-primary border border-secondary rounded-xl w-full h-full" >
                {children}
            </div>
        </div>
    );
}

export default MainContent;