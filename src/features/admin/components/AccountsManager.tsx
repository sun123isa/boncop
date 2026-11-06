"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { Status } from "@/generated/prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { updateFreelanceStatus } from "../actions";
import {
  buildAdminDashboardHref,
  type PaginatedResult,
} from "../pagination";
import type { AccountStatusFilter, AdminFreelanceAccount } from "../queries";
import {
  getAccountDisplayName,
  getStatusBadgeVariant,
  getStatusLabel,
} from "@/lib/status-label";
import { Pagination } from "./Pagination";

const FILTERS: Array<{ value: AccountStatusFilter; label: string }> = [
  { value: "ALL", label: "Tous" },
  { value: "ATTENTE", label: "En attente" },
  { value: "VALIDATE", label: "Validés" },
  { value: "BANNI", label: "Bannis" },
];

type AccountsManagerProps = {
  accounts: PaginatedResult<AdminFreelanceAccount>;
  counts: Record<AccountStatusFilter, number>;
  activeFilter: AccountStatusFilter;
  metiersPage: number;
};

function accountMeta(account: AdminFreelanceAccount): string {
  const parts = [account.email];
  if (account.ville?.trim()) {
    parts.push(account.ville.trim());
  }
  return parts.join(" · ");
}

export function AccountsManager({
  accounts,
  counts,
  activeFilter,
  metiersPage,
}: AccountsManagerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function changeStatus(userId: number, status: Status, label: string) {
    const confirmed = window.confirm(
      `Confirmer l'action « ${label} » pour ce compte ?`,
    );
    if (!confirmed) return;

    setError(null);
    startTransition(async () => {
      const result = await updateFreelanceStatus(userId, status);
      if (!result.success) {
        setError(result.error);
      }
    });
  }

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-600">
            Modération
          </p>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
            Comptes freelances
          </h2>
        </div>
      </div>

      <div
        className="mt-4 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filtrer les comptes"
      >
        {FILTERS.map((filter) => {
          const active = activeFilter === filter.value;
          return (
            <Link
              key={filter.value}
              href={buildAdminDashboardHref({
                status: filter.value,
                page: 1,
                metiersPage,
              })}
              role="tab"
              aria-selected={active}
              className={
                active
                  ? "inline-flex min-h-9 items-center rounded-full bg-slate-900 px-3 text-xs font-semibold text-white"
                  : "inline-flex min-h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              }
            >
              {filter.label}
              <span className="ml-1.5 opacity-70">{counts[filter.value]}</span>
            </Link>
          );
        })}
      </div>

      {error ? (
        <p className="mt-3 rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger-fg">
          {error}
        </p>
      ) : null}

      {accounts.items.length === 0 ? (
        <p className="mt-4 rounded-lg bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">
          Aucun compte dans cette catégorie.
        </p>
      ) : (
        <>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Compte</th>
                  <th className="px-3 py-2 font-semibold">Statut</th>
                  <th className="px-3 py-2 font-semibold">Métiers</th>
                  <th className="px-3 py-2 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {accounts.items.map((account) => {
                  const name = getAccountDisplayName(account);
                  const metiersLabel =
                    account.metiers.length > 0
                      ? account.metiers.slice(0, 2).join(", ") +
                        (account.metiers.length > 2
                          ? ` +${account.metiers.length - 2}`
                          : "")
                      : null;

                  return (
                    <tr key={account.id}>
                      <td className="max-w-56 px-3 py-2">
                        <p className="truncate font-semibold text-slate-900">
                          {name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {accountMeta(account)}
                        </p>
                      </td>
                      <td className="px-3 py-2">
                        <Badge
                          variant={getStatusBadgeVariant(account.validated)}
                        >
                          {getStatusLabel(account.validated)}
                        </Badge>
                      </td>
                      <td className="max-w-40 px-3 py-2 text-xs text-slate-600">
                        {metiersLabel ?? (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap justify-end gap-1.5">
                          {account.validated !== "VALIDATE" ? (
                            <Button
                              type="button"
                              size="sm"
                              disabled={isPending}
                              onClick={() =>
                                changeStatus(account.id, "VALIDATE", "Valider")
                              }
                            >
                              Valider
                            </Button>
                          ) : null}
                          {account.validated !== "BANNI" ? (
                            <Button
                              type="button"
                              variant="danger"
                              size="sm"
                              disabled={isPending}
                              onClick={() =>
                                changeStatus(account.id, "BANNI", "Bannir")
                              }
                            >
                              Bannir
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              disabled={isPending}
                              onClick={() =>
                                changeStatus(
                                  account.id,
                                  "ATTENTE",
                                  "Remettre en attente",
                                )
                              }
                            >
                              Réouvrir
                            </Button>
                          )}
                          {account.validated === "VALIDATE" ? (
                            <Link
                              href={`/profile/${account.id}`}
                              className="inline-flex h-11 items-center px-2 text-xs font-semibold text-brand-600 hover:underline"
                            >
                              Profil
                            </Link>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            page={accounts.page}
            totalPages={accounts.totalPages}
            total={accounts.total}
            pageSize={accounts.pageSize}
            label="comptes"
            buildHref={(page) =>
              buildAdminDashboardHref({
                status: activeFilter,
                page,
                metiersPage,
              })
            }
          />
        </>
      )}
    </Card>
  );
}
