export default function NumberInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
    return (
        <div className="flex border border-secondary rounded-md text-md">
            <button className="w-5 aspect-1 border-r border-secondary hover:bg-secondary" onClick={() => onChange(value - 1)}>
                -
            </button>
            <input type="text" className="max-w-10 :focus-visible:outline-none! focus:outline-none focus:border-none text-center" value={value} onChange={(e) => onChange(parseInt(e.target.value || '0'))} />
            <button className="w-5 aspect-1 border-l border-secondary hover:bg-secondary" onClick={() => onChange(value + 1)}>
                +
            </button>
        </div>
    );
}