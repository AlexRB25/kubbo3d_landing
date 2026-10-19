"use client";

import { useEffect, useState } from "react";
import type { Plan } from "./plans";
import { useSession } from "./session";
import { supabase } from "./supabase";

export type Subscription = {
  id: string;
  plan_id: string;
  /** Null for plans given from the admin panel. */
  mp_preapproval_id: string | null;
  /** "admin": given by Kubbo3D without charging (tests, courtesies). */
  source: "mercadopago" | "admin";
  /** Hand-given plans that never end. */
  lifetime: boolean;
  status: "pending" | "authorized" | "paused" | "cancelled";
  amount: number;
  currency: string;
  payer_email: string;
  paid_until: string | null;
  next_payment_date: string | null;
};

export type MyPlan = {
  plan: Plan;
  subscription: Subscription | null;
  usage: { products: number; printers: number; tool_runs_month: number; tool_downloads_month?: number; storage_mb: number };
};

/** The signed-in user's plan, subscription and usage (null while loading or signed out). */
export function useMyPlan(version = 0): { myPlan: MyPlan | null; error: string } {
  const { session } = useSession();
  const [state, setState] = useState<{ key: string; myPlan: MyPlan | null; error: string }>({ key: "", myPlan: null, error: "" });
  const key = session ? `${session.user.id}:${version}` : "";

  useEffect(() => {
    if (!key) return;
    let current = true;
    supabase()
      .rpc("my_plan")
      .then(({ data, error }) => {
        if (current) setState({ key, myPlan: error ? null : (data as MyPlan), error: error ? error.message : "" });
      });
    return () => {
      current = false;
    };
  }, [key]);

  return state.key === key ? { myPlan: state.myPlan, error: state.error } : { myPlan: null, error: "" };
}
