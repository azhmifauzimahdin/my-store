"use client";
import Link from "next/link";
import styles from "./register.module.scss";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { push } = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const response = await fetch("/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setIsLoading(false);

    if (response.ok) {
      form.reset();
      push("/auth/login");
    } else {
      setError("Email is already registered");
    }
  };

  return (
    <div className={styles.register}>
      <h1 className={styles.register__title}>Register</h1>
      {error && <p className={styles.register__error}>{error}</p>}
      <div className={styles.register__form}>
        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" name="email" />
          <Input label="Fullname" type="text" name="fullname" />
          <Input label="Phone" type="text" name="phone" />
          <Input label="Password" type="password" name="password" />
          <Button type="submit" className={styles.register__form__button}>
            {isLoading ? "Loading..." : "Register"}
          </Button>
        </form>
      </div>
      <p className={styles.register__link}>
        Have an acoount? Sign in <Link href="login">Here</Link>
      </p>
    </div>
  );
}
