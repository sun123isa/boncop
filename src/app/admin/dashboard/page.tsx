import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { AccountsManager } from "@/features/admin/components/AccountsManager";
import { MetiersManager } from "@/features/admin/components/MetiersManager";
import { parsePage } from "@/features/admin/pagination";
import {
  getAdminAccountCounts,
  getAdminFreelanceAccounts,
  getAdminMetiers,
  getAdminMetiersTotal,
  type AccountStatusFilter,
} from "@/features/admin/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Espace administration",
  description:
    "Validez les comptes freelances et gérez les métiers de la plateforme BonCop.",
};

type DashboardPageProps = {
  searchParams: Promise<{
    status?: string | string[];
    page?: string | string[];
    metiersPage?: string | string[];
  }>;
};

function parseStatusFilter(
  value: string | string[] | undefined,
): AccountStatusFilter {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "ATTENTE" || raw === "VALIDATE" || raw === "BANNI") {
    return raw;
  }
  return "ALL";
}

export default async function AdminDashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const statusFilter = parseStatusFilter(params.status);
  const accountsPage = parsePage(params.page);
  const metiersPage = parsePage(params.metiersPage);

  const [metiers, accounts, counts, metiersTotal] = await Promise.all([
    getAdminMetiers(metiersPage),
    getAdminFreelanceAccounts(statusFilter, accountsPage),
    getAdminAccountCounts(),
    getAdminMetiersTotal(),
  ]);

  return (
    <>
      <section className="mesh-bg relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 grid-bg opacity-40"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Badge variant="info" className="mb-5">
            Administration
          </Badge>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Gérez les{" "}
            <span className="text-gradient">comptes</span> et les métiers
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Validez les freelances avant publication, bannissez les abus, et
            maintenez le référentiel des métiers.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-6 max-w-7xl px-4 sm:-mt-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="text-center sm:p-5">
            <p className="text-3xl font-extrabold tracking-tight text-gradient">
              {counts.ATTENTE}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              En attente de validation
            </p>
          </Card>
          <Card className="text-center sm:p-5">
            <p className="text-3xl font-extrabold tracking-tight text-gradient">
              {counts.VALIDATE}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Comptes publiés
            </p>
          </Card>
          <Card className="text-center sm:p-5">
            <p className="text-3xl font-extrabold tracking-tight text-gradient">
              {metiersTotal}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Métiers référencés
            </p>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <AccountsManager
          accounts={accounts}
          counts={counts}
          activeFilter={statusFilter}
          metiersPage={metiers.page}
        />
        <MetiersManager
          metiers={metiers}
          statusFilter={statusFilter}
          accountsPage={accounts.page}
        />
      </section>
    </>
  );
}
