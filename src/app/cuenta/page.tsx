import type { Metadata } from "next";
import { Suspense } from "react";
import { MyPlanPanel } from "@/components/MyPlanPanel";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Mi plan · Kubbo3D" };

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12">
        <h1 className="text-3xl font-bold">Mi plan</h1>
        <Suspense>
          <MyPlanPanel />
        </Suspense>
      </main>
    </>
  );
}
