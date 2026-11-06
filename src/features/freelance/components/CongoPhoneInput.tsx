"use client";

import type { InputHTMLAttributes } from "react";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { formatCongoPhone } from "../contact";

type CongoPhoneInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "type" | "value" | "defaultValue" | "onChange"
> & {
  id?: string;
  label: string;
  name: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
  defaultValue?: string;
};

/**
 * Champ téléphone / WhatsApp avec formatage live Congo (+242) :
 * `06 123 45 67` ou `+242 06 123 45 67`.
 */
export function CongoPhoneInput({
  defaultValue = "",
  hint = "Format : 06 123 45 67",
  ...props
}: CongoPhoneInputProps) {
  const [value, setValue] = useState(() => formatCongoPhone(defaultValue));

  return (
    <Input
      {...props}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder="06 123 45 67"
      hint={hint}
      value={value}
      onChange={(event) => {
        setValue(formatCongoPhone(event.target.value));
      }}
    />
  );
}
