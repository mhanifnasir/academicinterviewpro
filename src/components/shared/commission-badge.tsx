import React from "react";
import { Badge } from "@/components/ui/badge";

export type Commission = "PPSC" | "FPSC" | "KPPSC" | "SPSC" | "BPSC" | "HEC" | "General";

export function CommissionBadge({ commission }: { commission: Commission | string }) {
  const norm = commission.toUpperCase();
  switch (norm) {
    case "PPSC":
      return (
        <Badge variant="ppsc" className="font-bold">
          Punjab (PPSC)
        </Badge>
      );
    case "FPSC":
      return (
        <Badge variant="fpsc" className="font-bold">
          Federal (FPSC)
        </Badge>
      );
    case "KPPSC":
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 font-bold">
          KPK (KPPSC)
        </Badge>
      );
    case "SPSC":
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 font-bold">
          Sindh (SPSC)
        </Badge>
      );
    case "BPSC":
      return (
        <Badge className="bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300 font-bold">
          Balochistan (BPSC)
        </Badge>
      );
    case "HEC":
      return (
        <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
          HEC / University
        </Badge>
      );
    default:
      return <Badge variant="secondary">{commission}</Badge>;
  }
}
