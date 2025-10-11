import { toast } from "@/components/ui/sonner";

export type TrackEvent = {
  name: string;
  payload?: Record<string, unknown>;
};

export function track(name: string, payload?: Record<string, unknown>) {
  // Demo-only tracking: console + toast
  // In production, send to Builder.io or analytics provider
  // eslint-disable-next-line no-console
  console.log("track", { name, payload, at: new Date().toISOString() });
  toast(name, {
    description: payload ? JSON.stringify(payload) : undefined,
  });
}
