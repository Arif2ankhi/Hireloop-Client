"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

/** Copies the value to the clipboard and flashes a check for 2s. */
export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy transaction ID"
      title="Copy transaction ID"
      className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
    >
      {copied ? (
        <CheckIcon className="size-3.5 text-emerald-400" />
      ) : (
        <CopyIcon className="size-3.5" />
      )}
    </button>
  );
}
