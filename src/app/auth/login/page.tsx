"use client";
import Link from "next/link";
import styles from "./login.module.scss";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl,
      });
      if (res?.ok) {
        setIsLoading(false);
        form.reset();
        push(callbackUrl);
      } else {
        setIsLoading(false);
        setError("Email or password is incorrect");
      }
    } catch (error) {
      setIsLoading(false);
      setError("Email or password is incorrect");
    }
  };

  return (
    <div className={styles.login}>
      <h1 className={styles.login__title}>Login</h1>
      {error && <p className={styles.login__error}>{error}</p>}
      <div className={styles.login__form}>
        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" name="email" />
          <Input label="Password" type="password" name="password" />
          <Button type="submit" className={styles.login__form__button}>
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </form>
        <hr className={styles.login__form__divider} />
        <div className={styles.login__form__other}>
          <Button
            type="button"
            onClick={() => signIn("google", { redirect: false, callbackUrl })}
            className={styles.login__form__other__button}
          >
            <i className="bx bxl-google"></i>
            Login With Google
          </Button>
        </div>
      </div>
      <p className={styles.login__link}>
        Don&apos;t have an account? Sign up <Link href="register">Here</Link>
      </p>
    </div>
  );
}
