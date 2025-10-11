type TextProps = {
    children?: React.ReactNode;
    style?:
    | "title-h1"
    | "title-h2"
    | "title-h3"
    | "title-h4"
    | "title-h5"
    | "title-h6"
    | "label-lg"
    | "label-bg"
    | "label-md"
    | "label-sm"
    | "label-xs"
    | "paragraph-lg"
    | "paragraph-bg"
    | "paragraph-md"
    | "paragraph-sm"
    | "paragraph-xs"
    | "subheading-bg"
    | "subheading-md"
    | "subheading-sm"
    | "subheading-xs"
};

function Text({ children, style }: TextProps) {
    return (
        <div className={style} >{children}</div>
    );
}

export default Text;