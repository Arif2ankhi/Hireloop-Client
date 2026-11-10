import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "cn";

/**
 * Shared bits of the dark job pages: numbered section heading, form labels,
 * and opinionated dark-styled field components so the classes live in one
 * place instead of repeating on every control.
 */

/** Numbered circle-dot heading, e.g. "1. Basic Information". */
function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="flex items-center gap-2 text-base font-semibold text-white">
      <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
      {children}
    </h2>
  );
}

/**
 * Dark form label with the brand required-star. Pass `required={false}` for
 * optional fields to omit the star, and `requiredHint` for a right-side
 * note (e.g. "Optional").
 */
function FieldLabel({
  htmlFor,
  requiredHint,
  required = true,
  children,
}: {
  htmlFor: string;
  requiredHint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label
        htmlFor={htmlFor}
        className="text-sm font-medium text-zinc-300 [&_span]:ml-0.5"
      >
        {children}
        {required ? <span className="text-brand">*</span> : null}
      </Label>
      {requiredHint ? (
        <span className="text-xs text-zinc-500">{requiredHint}</span>
      ) : null}
    </div>
  );
}

/** Shared dark control classes — single source for the themed inputs. */
const darkFieldClass =
  "border-white/10 bg-[#1a1a20] text-white placeholder:text-zinc-500";

/**
 * Dark text input with its label. `icon` puts a lucide icon inside the
 * field's left padding; extra native input props (`type`, `min`,
 * `placeholder`, `required`, …) pass straight through, and `className`
 * merges onto the input itself.
 */
function TextField({
  id,
  label,
  requiredHint,
  icon: Icon,
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  requiredHint?: string;
  icon?: LucideIcon;
}) {
  const input = (
    <Input id={id} className={cn(darkFieldClass, Icon && "pl-9", className)} {...props} />
  );

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor={id} requiredHint={requiredHint}>
        {label}
      </FieldLabel>
      {Icon ? (
        <div className="relative">
          <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
          {input}
        </div>
      ) : (
        input
      )}
    </div>
  );
}

/**
 * Dark native select with its label. `placeholder` renders the initial
 * disabled empty option (the label, e.g. "Select a category");
 * `required={false}` omits the label's star for optional selects.
 */
function SelectField({
  id,
  label,
  requiredHint,
  required = true,
  options,
  placeholder,
  className,
  ...props
}: Omit<React.ComponentProps<"select">, "id" | "size"> & {
  id: string;
  label: string;
  requiredHint?: string;
  required?: boolean;
  options: ReadonlyArray<string>;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor={id} requiredHint={requiredHint} required={required}>
        {label}
      </FieldLabel>
      <NativeSelect
        id={id}
        required={required || undefined}
        className={cn("w-full", className)}
        {...props}
      >
        {placeholder ? (
          <NativeSelectOption value="" disabled>
            {placeholder}
          </NativeSelectOption>
        ) : null}
        {options.map((option) => (
          <NativeSelectOption key={option} value={option}>
            {option}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}

/**
 * Dark textarea with its label; native props (`rows`, `placeholder`,
 * `required`, `defaultValue`, …) pass straight through.
 */
function TextareaField({
  id,
  label,
  requiredHint,
  className,
  ...props
}: Omit<React.ComponentProps<"textarea">, "id"> & {
  id: string;
  label: string;
  requiredHint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor={id} requiredHint={requiredHint}>
        {label}
      </FieldLabel>
      <Textarea id={id} className={cn(darkFieldClass, className)} {...props} />
    </div>
  );
}

export { FieldLabel, SectionHeading, SelectField, TextField, TextareaField };
