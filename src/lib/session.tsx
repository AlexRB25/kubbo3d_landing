"use client";

import type { Session } from "@supabase/supabase-js";
import { createContext, use, useEffect, useState, type PropsWithChildren } from "react";
import { supabase } from "./supabase";

type SessionState = { session: Session | null; loading: boolean };

const SessionContext = createContext<SessionState>({ session: null, loading: true });

export const useSession = () => use(SessionContext);

export function SessionProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<SessionState>({ session: null, loading: true });

  useEffect(() => {
    // Fires once on load with the stored session, then on every sign-in, sign-out and refresh.
    const { data } = supabase().auth.onAuthStateChange((event, session) => {
      setState({ session, loading: false });
      // Counts the visit in the same usage metrics as the calculator. Deferred: Supabase must not be
      // called again from inside this callback.
      if (session && (event === "INITIAL_SESSION" || event === "SIGNED_IN")) {
        setTimeout(() => supabase().rpc("touch").then(() => {}), 0);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return <SessionContext value={state}>{children}</SessionContext>;
}
