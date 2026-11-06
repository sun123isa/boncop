import { Skeleton, SkeletonRegion } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <SkeletonRegion label="Chargement de la page d'accueil">
      <section className="bg-brand-800">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <Skeleton className="h-10 w-full max-w-xl md:h-[52px]" />
            <Skeleton className="mt-4 h-7 w-full max-w-2xl" />
            <Skeleton className="mt-2 h-7 w-2/3 max-w-md" />
          </div>
        </div>
      </section>

      <section className="border-b border-line-200 bg-surface-100">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex flex-col items-center">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="mt-1 h-5 w-40" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-72 max-w-full" />
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex gap-4">
              <Skeleton
                className="h-10 w-10 shrink-0"
                style={{ borderRadius: 9999 }}
              />
              <div className="flex-1">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="mt-2 h-5 w-full" />
                <Skeleton className="mt-1 h-5 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-brand-100 px-6 py-12 sm:px-12">
          <div className="max-w-2xl">
            <Skeleton className="h-8 w-80 max-w-full" />
            <Skeleton className="mt-3 h-6 w-full" />
            <Skeleton className="mt-1 h-6 w-2/3" />
            <div className="mt-6 flex flex-wrap gap-3">
              <Skeleton className="h-12 w-36" />
              <Skeleton className="h-12 w-36" />
            </div>
          </div>
        </div>
      </section>
    </SkeletonRegion>
  );
}
