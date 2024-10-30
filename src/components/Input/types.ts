type size = "default" | "small";

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    height: size;

    textLabel?: string;

    textError?: string;

    icon?: string;
    disabled?: boolean;
}