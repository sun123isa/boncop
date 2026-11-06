"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { createMetier, deleteMetier, restoreMetier } from "../actions";
import { buildAdminDashboardHref, type PaginatedResult } from "../pagination";
import type { AccountStatusFilter, AdminMetier } from "../queries";
import { Pagination } from "./Pagination";

type MetiersManagerProps = {
  metiers: PaginatedResult<AdminMetier>;
  statusFilter: AccountStatusFilter;
  accountsPage: number;
};

export function MetiersManager({
  metiers,
  statusFilter,
  accountsPage,
}: MetiersManagerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const libelle = String(formData.get("libelle") ?? "");

    startTransition(async () => {
      const result = await createMetier(libelle);
      if (!result.success) {
        setError(result.error);
        return;
      }
      form.reset();
    });
  }

  function onDeactivate(id: number, libelle: string) {
    const confirmed = window.confirm(
      `Désactiver le métier « ${libelle} » ? Il disparaîtra des filtres publics.`,
    );
    if (!confirmed) return;

    setError(null);
    startTransition(async () => {
      const result = await deleteMetier(id);
      if (!result.success) {
        setError(result.error);
      }
    });
  }

  function onRestore(id: number) {
    setError(null);
    startTransition(async () => {
      const result = await restoreMetier(id);
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
            Référentiel
          </p>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
            Métiers
          </h2>
        </div>
        <p className="text-xs text-slate-500">{metiers.total} au total</p>
      </div>

      <form
        onSubmit={onCreate}
        className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end"
      >
        <Input
          label="Nouveau métier"
          name="libelle"
          required
          maxLength={80}
          placeholder="Ex. Développeur web"
          containerClassName="flex-1"
        />
        <Button type="submit" loading={isPending} size="sm">
          Ajouter
        </Button>
      </form>

      {error ? (
        <p className="mt-3 rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger-fg">
          {error}
        </p>
      ) : null}

      {metiers.items.length === 0 ? (
        <p className="mt-4 rounded-lg bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">
          Aucun métier enregistré.
        </p>
      ) : (
        <>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Libellé</th>
                  <th className="px-3 py-2 font-semibold">Statut</th>
                  <th className="px-3 py-2 font-semibold">Freelances</th>
                  <th className="px-3 py-2 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metiers.items.map((metier) => (
                  <tr
                    key={metier.id}
                    className={metier.isActif ? "bg-white" : "bg-slate-50/80"}
                  >
                    <td className="px-3 py-2 font-medium text-slate-900">
                      {metier.libelle}
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant={metier.isActif ? "success" : "neutral"}>
                        {metier.isActif ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {metier.freelancesCount}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {metier.isActif ? (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          disabled={isPending}
                          onClick={() =>
                            onDeactivate(metier.id, metier.libelle)
                          }
                        >
                          Désactiver
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={isPending}
                          onClick={() => onRestore(metier.id)}
                        >
                          Réactiver
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={metiers.page}
            totalPages={metiers.totalPages}
            total={metiers.total}
            pageSize={metiers.pageSize}
            label="métiers"
            buildHref={(metiersPage) =>
              buildAdminDashboardHref({
                status: statusFilter,
                page: accountsPage,
                metiersPage,
              })
            }
          />
        </>
      )}
    </Card>
  );
}
