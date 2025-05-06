import styles from "./Input.module.scss";

type InputProps = {
  label?: string;
  name: string;
  type: string;
  placeholder?: string;
};
export default function Input(props: InputProps) {
  const { label, name, type, placeholder } = props;
  return (
    <div className={styles.container}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        className={styles.container__input}
      />
    </div>
  );
}
