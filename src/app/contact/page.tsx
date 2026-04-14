"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-[var(--vsc-bg)] text-[var(--vsc-text)]">
      <main className="mx-auto w-full max-w-2xl p-6 md:p-10">
        <Link
          href="/"
          className="mb-8 inline-block border border-[var(--vsc-border)] px-3 py-1 font-mono text-xs text-[var(--vsc-accent)] hover:bg-[var(--vsc-panel)]"
        >
          ← Back to portfolio
        </Link>

        <article className="border border-[var(--vsc-border)] bg-[var(--vsc-panel)] p-5 md:p-8">
          <p className="font-mono text-xs text-[var(--vsc-muted)]">
            {"// contact.ts"}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Get in touch
          </h1>
          <p className="mt-3 text-base leading-7 text-[var(--vsc-muted)]">
            I'd love to hear from you. Send me a message about your project,
            ideas, or just to say hello.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[var(--vsc-text)]"
              >
                Your name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="mt-2 w-full border border-[var(--vsc-border)] bg-[var(--vsc-bg)] px-3 py-2 text-[var(--vsc-text)] placeholder-[var(--vsc-muted)] focus:border-[var(--vsc-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--vsc-accent)]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--vsc-text)]"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="mt-2 w-full border border-[var(--vsc-border)] bg-[var(--vsc-bg)] px-3 py-2 text-[var(--vsc-text)] placeholder-[var(--vsc-muted)] focus:border-[var(--vsc-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--vsc-accent)]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[var(--vsc-text)]"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                rows={6}
                className="mt-2 w-full border border-[var(--vsc-border)] bg-[var(--vsc-bg)] px-3 py-2 text-[var(--vsc-text)] placeholder-[var(--vsc-muted)] focus:border-[var(--vsc-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--vsc-accent)]"
                placeholder="Tell me about your project..."
              />
            </div>

            {status === "error" && (
              <div className="border border-[var(--vsc-string)] bg-[var(--vsc-bg)] p-3 text-sm text-[var(--vsc-string)]">
                {errorMessage}
              </div>
            )}

            {status === "success" && (
              <div className="border border-[var(--vsc-comment)] bg-[var(--vsc-bg)] p-3 text-sm text-[var(--vsc-comment)]">
                Thanks for reaching out! I'll get back to you soon.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full border border-[var(--vsc-accent)] bg-[var(--vsc-accent)] px-4 py-2.5 text-sm font-medium text-[var(--vsc-bg)] transition-colors hover:bg-[var(--vsc-keyword)] disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send message"}
            </button>

            <p className="text-center text-xs text-[var(--vsc-muted)]">
              Or email me directly at{" "}
              <a
                href="mailto:zainedeveloper@gmail.com"
                className="text-[var(--vsc-accent)] hover:underline"
              >
                zainedeveloper@gmail.com
              </a>
            </p>
          </form>
        </article>
      </main>
    </div>
  );
}
