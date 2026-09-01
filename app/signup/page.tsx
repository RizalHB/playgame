"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { signUp } from "@/lib/actions/auth";

type FormErrors = {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  form?: string;
};

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [acceptTerms, setAcceptTerms] =
    useState(false);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [pending, setPending] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};

    const normalizedEmail =
      email.trim().toLowerCase();

    const normalizedUsername =
      username.trim();

    if (!normalizedEmail) {
      nextErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!normalizedUsername) {
      nextErrors.username =
        "Username is required.";
    } else if (
      normalizedUsername.length < 3 ||
      normalizedUsername.length > 30
    ) {
      nextErrors.username =
        "Username must be 3–30 characters.";
    } else if (
      !/^[a-zA-Z0-9_]+$/.test(
        normalizedUsername
      )
    ) {
      nextErrors.username =
        "Use only letters, numbers, and underscores.";
    }

    if (!password) {
      nextErrors.password =
        "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password =
        "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      password !== confirmPassword
    ) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (!acceptTerms) {
      nextErrors.terms =
        "You must accept the Terms and Privacy Policy.";
    }

    return nextErrors;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrors({});
    setSuccess(false);

    const validationErrors =
      validate();

    if (
      Object.keys(validationErrors)
        .length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    setPending(true);

    try {
      const result = await signUp({
        email: email.trim().toLowerCase(),
        username: username.trim(),
        password,
      });

      if (!result.success) {
        setErrors({
          form:
            result.error ??
            "Unable to create your account.",
        });

        return;
      }

      setPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch {
      setErrors({
        form:
          "Something went wrong. Please try again.",
      });
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 text-white">
        <section
          className="
            w-full
            max-w-md
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900
            p-6
            shadow-2xl
            sm:p-8
          "
        >
          <div className="flex justify-center">
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-green-500/10
                text-green-400
              "
            >
              <CheckCircle2
                size={30}
                aria-hidden="true"
              />
            </div>
          </div>

          <h1 className="mt-5 text-center text-2xl font-bold">
            Account created
          </h1>

          <p className="mt-3 text-center text-sm leading-6 text-zinc-400">
            Your PlayGame account has been
            created successfully.
          </p>

          <Link
            href="/"
            className="
              mt-6
              flex
              w-full
              items-center
              justify-center
              rounded-xl
              bg-blue-600
              px-4
              py-3
              font-semibold
              text-white
              transition
              hover:bg-blue-500
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:ring-offset-2
              focus:ring-offset-zinc-900
            "
          >
            Continue to PlayGame
          </Link>

          <p className="mt-4 text-center text-xs text-zinc-500">
            Your session has been created
            securely.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <header className="text-center">
          <Link
            href="/"
            className="
              inline-flex
              items-center
              rounded-lg
              text-xl
              font-black
              tracking-tight
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            PlayGame
          </Link>

          <h1 className="mt-8 text-2xl font-bold sm:text-3xl">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Join PlayGame and start building
            your game library.
          </p>
        </header>

        <section
          className="
            mt-8
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900
            p-5
            shadow-2xl
            sm:p-8
          "
        >
          {errors.form && (
            <div
              role="alert"
              className="
                mb-5
                rounded-xl
                border
                border-red-500/30
                bg-red-500/10
                px-4
                py-3
                text-sm
                text-red-300
              "
            >
              {errors.form}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                aria-invalid={Boolean(
                  errors.email
                )}
                aria-describedby={
                  errors.email
                    ? "email-error"
                    : undefined
                }
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  border-zinc-700
                  bg-zinc-950
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  placeholder:text-zinc-600
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                "
                placeholder="you@example.com"
                disabled={pending}
              />

              {errors.email && (
                <p
                  id="email-error"
                  className="mt-2 text-xs text-red-400"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                aria-invalid={Boolean(
                  errors.username
                )}
                aria-describedby={
                  errors.username
                    ? "username-error"
                    : undefined
                }
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  border-zinc-700
                  bg-zinc-950
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  placeholder:text-zinc-600
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                "
                placeholder="Choose a username"
                disabled={pending}
              />

              {errors.username ? (
                <p
                  id="username-error"
                  className="mt-2 text-xs text-red-400"
                >
                  {errors.username}
                </p>
              ) : (
                <p className="mt-2 text-xs text-zinc-500">
                  3–30 characters. Letters,
                  numbers, and underscores.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium"
              >
                Password
              </label>

              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  aria-invalid={Boolean(
                    errors.password
                  )}
                  aria-describedby={
                    errors.password
                      ? "password-error"
                      : "password-help"
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-zinc-700
                    bg-zinc-950
                    px-4
                    py-3
                    pr-12
                    text-sm
                    outline-none
                    transition
                    placeholder:text-zinc-600
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/20
                  "
                  placeholder="Create a password"
                  disabled={pending}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="
                    absolute
                    right-2
                    top-1/2
                    -translate-y-1/2
                    rounded-lg
                    p-2
                    text-zinc-400
                    hover:text-white
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={pending}
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      aria-hidden="true"
                    />
                  ) : (
                    <Eye
                      size={18}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>

              {errors.password ? (
                <p
                  id="password-error"
                  className="mt-2 text-xs text-red-400"
                >
                  {errors.password}
                </p>
              ) : (
                <p
                  id="password-help"
                  className="mt-2 text-xs text-zinc-500"
                >
                  Use at least 8 characters.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Confirm password
              </label>

              <div className="relative mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  aria-invalid={Boolean(
                    errors.confirmPassword
                  )}
                  aria-describedby={
                    errors.confirmPassword
                      ? "confirm-password-error"
                      : undefined
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-zinc-700
                    bg-zinc-950
                    px-4
                    py-3
                    pr-12
                    text-sm
                    outline-none
                    transition
                    placeholder:text-zinc-600
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/20
                  "
                  placeholder="Enter your password again"
                  disabled={pending}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                  className="
                    absolute
                    right-2
                    top-1/2
                    -translate-y-1/2
                    rounded-lg
                    p-2
                    text-zinc-400
                    hover:text-white
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmation password"
                      : "Show confirmation password"
                  }
                  disabled={pending}
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      size={18}
                      aria-hidden="true"
                    />
                  ) : (
                    <Eye
                      size={18}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p
                  id="confirm-password-error"
                  className="mt-2 text-xs text-red-400"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(event) =>
                  setAcceptTerms(
                    event.target.checked
                  )
                }
                disabled={pending}
                className="
                  mt-1
                  h-4
                  w-4
                  rounded
                  border-zinc-700
                  bg-zinc-950
                  text-blue-600
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <span className="text-xs leading-5 text-zinc-400">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {errors.terms && (
              <p className="-mt-3 text-xs text-red-400">
                {errors.terms}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-4
                py-3
                font-semibold
                text-white
                transition
                hover:bg-blue-500
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:ring-offset-2
                focus:ring-offset-zinc-900
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {pending ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs text-zinc-500">
              OR
            </span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <button
            type="button"
            disabled
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-zinc-700
              bg-zinc-950
              px-4
              py-3
              text-sm
              font-semibold
              text-zinc-400
              opacity-70
            "
            title="Google sign-up will be enabled in the authentication integration step."
          >
            Continue with Google
          </button>

          <div
            className="
              mt-5
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-zinc-800
              bg-zinc-950/60
              p-3
            "
          >
            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-green-400"
              aria-hidden="true"
            />

            <p className="text-xs leading-5 text-zinc-500">
              Your password is securely hashed
              before it is stored. Never share
              your password with anyone.
            </p>
          </div>
        </section>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="
              font-medium
              text-blue-400
              hover:text-blue-300
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}