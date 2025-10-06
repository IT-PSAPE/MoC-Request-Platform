type TextProps = {
    children?: React.ReactNode;
    style: "title" | "subtitle" | "body" | "caption";
};

function Text({ children, style }: TextProps) {

    const styleClasses = {
        title: "text-2xl font-bold",
        subtitle: "text-lg text-muted-foreground",
        body: "text-base",
        caption: "text-sm text-muted-foreground",
    }[style];

    return (
        <div className={styleClasses} >{children}</div>
    );
}

export default Text;