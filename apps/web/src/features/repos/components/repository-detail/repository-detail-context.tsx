"use client";

import { createContext, useContext } from "react";

import { type RepositoryDashboardListItem } from "@/features/repos/types";
import { type RepositoryDetailModel } from "./repository-detail-utils";

type RepositoryDetailContextValue = {
  /** Repository dashboard projection selected by slug. */
  project: RepositoryDashboardListItem;
  /** Related repositories surfaced for continued exploration. */
  relatedProjects: RepositoryDashboardListItem[];
  /** Normalized analytics model for tab rendering. */
  model: RepositoryDetailModel;
  /** Pull-request merge rate percentage. */
  mergeRate: number;
  /** Issue closure rate percentage. */
  issueClosureRate: number;
  /** Open pull-request ratio percentage. */
  prOpenRatio: number;
  /** Deployment success rate percentage, when available. */
  deploymentSuccessRate: number | null;
  /** Gate admin tab visibility based on environment and role. */
  canViewAdminTab: boolean;
};

type RepositoryDetailProviderProps = {
  /** Context payload consumed by header and tabs. */
  value: RepositoryDetailContextValue;
  /** Child components that consume repository detail context. */
  children: React.ReactNode;
};

const RepositoryDetailContext =
  createContext<RepositoryDetailContextValue | null>(null);

/**
 * Provide shared repository detail data for nested page components.
 *
 * @param props - Context value and children tree.
 * @returns Context provider wrapping repository detail descendants.
 */
export function RepositoryDetailProvider({
  value,
  children,
}: RepositoryDetailProviderProps) {
  return (
    <RepositoryDetailContext.Provider value={value}>
      {children}
    </RepositoryDetailContext.Provider>
  );
}

/**
 * Read shared repository detail data for header and tab components.
 *
 * @returns Repository detail context value.
 * @throws If called outside a `RepositoryDetailProvider`.
 */
export function useRepositoryDetailContext(): RepositoryDetailContextValue {
  const context = useContext(RepositoryDetailContext);
  if (!context) {
    throw new Error(
      "useRepositoryDetailContext must be used within a RepositoryDetailProvider",
    );
  }
  return context;
}
