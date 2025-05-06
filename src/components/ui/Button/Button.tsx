import styles from "./Button.module.scss";

type ButtonProps = {
  type: "submit" | "reset" | "button";
  onClick?: () => void;
  children: React.ReactNode;
  variant?: string;
  className?: string;
};
export default function Button(props: ButtonProps) {
  const { type, onClick, children, variant = "primary", className } = props;
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
