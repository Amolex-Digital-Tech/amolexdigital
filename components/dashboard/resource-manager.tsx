"use client";

import { type FormEvent, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "list" | "date" | "checkbox";
  placeholder?: string;
};

type ResourceManagerProps = {
  title: string;
  description: string;
  endpoint: string;
  fields: Field[];
  initialItems: Record<string, unknown>[];
};

function formatValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value ?? "");
}

export function ResourceManager({ title, description, endpoint, fields, initialItems }: ResourceManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const payload = fields.reduce<Record<string, unknown>>((accumulator, field) => {
        if (field.type === "checkbox") {
          accumulator[field.name] = formData.get(field.name) === "on";
          return accumulator;
        }

        const raw = String(formData.get(field.name) ?? "");

        if (field.type === "list") {
          accumulator[field.name] = raw
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          return accumulator;
        }

        accumulator[field.name] = raw;
        return accumulator;
      }, {});

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error ?? "Request failed.");
        return;
      }

      setItems((current) => [result.item, ...current]);
      setMessage("Saved successfully.");
      form.reset();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form id={`${title}-form`} onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <label key={field.name} className="grid gap-2 text-sm">
                <span className="font-medium text-foreground">{field.label}</span>
                {field.type === "textarea" ? (
                  <Textarea name={field.name} placeholder={field.placeholder} />
                ) : field.type === "checkbox" ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
                    <input type="checkbox" name={field.name} className="h-4 w-4 accent-secondary" />
                    <span className="text-muted-foreground">Mark as enabled</span>
                  </div>
                ) : (
                  <Input
                    name={field.name}
                    type={field.type === "date" ? "date" : "text"}
                    placeholder={field.placeholder}
                  />
                )}
              </label>
            ))}
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Create entry"}
            </Button>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Current entries</CardTitle>
          <CardDescription>Preview of managed content in this section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="rounded-[1.5rem] border border-border/80 bg-background/50 p-5">
              <div className="grid gap-3">
                {Object.entries(item).map(([key, value]) => (
                  <div key={key} className="grid gap-1">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{key}</p>
                    <p className="text-sm leading-7 text-foreground">{formatValue(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
