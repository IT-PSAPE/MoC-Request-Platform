export default function Header({ children }: { children?: React.ReactNode }) {
    return (
        <div className="px-margin py-4 w-full max-w-container mx-auto" >
            {children}
        </div>
    );
}
