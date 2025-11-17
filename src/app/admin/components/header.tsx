export default function Header({ children }: { children?: React.ReactNode }) {
    return (
        <div className="px-(--margin) py-4" >
            {children}
        </div>
    );
}
