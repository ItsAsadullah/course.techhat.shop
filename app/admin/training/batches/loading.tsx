function SkeletonBlock({
  className,
}: {
  className: string;
}) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />;
}

export default function LoadingTrainingBatchesPage() {
  return (
    <div className="min-h-full bg-[#F7F8FA]">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-4 sm:p-6 xl:p-8">
        <section className="rounded-[28px] border border-[#E5E7EB] bg-white dark:bg-slate-900 px-5 py-6 shadow-sm sm:px-7 sm:py-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-4">
              <SkeletonBlock className="h-7 w-36 rounded-full" />
              <SkeletonBlock className="h-10 w-72" />
              <SkeletonBlock className="h-5 w-[32rem] max-w-full" />
              <div className="flex flex-wrap gap-2">
                <SkeletonBlock className="h-8 w-28 rounded-full" />
                <SkeletonBlock className="h-8 w-28 rounded-full" />
                <SkeletonBlock className="h-8 w-28 rounded-full" />
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 xl:w-[470px]">
              <div className="flex flex-wrap gap-2 xl:justify-end">
                <SkeletonBlock className="h-10 w-32" />
                <SkeletonBlock className="h-10 w-24" />
                <SkeletonBlock className="h-10 w-24" />
                <SkeletonBlock className="h-10 w-24" />
              </div>
              <SkeletonBlock className="h-11 w-full" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#E5E7EB] bg-white dark:bg-slate-900 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-full space-y-3">
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="h-9 w-16" />
                  <SkeletonBlock className="h-3 w-28" />
                </div>
                <SkeletonBlock className="h-11 w-11" />
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-[24px] border border-[#E5E7EB] bg-white dark:bg-slate-900 shadow-sm">
          <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-5 sm:px-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <SkeletonBlock className="h-6 w-40" />
                  <SkeletonBlock className="h-4 w-72 max-w-full" />
                </div>
                <SkeletonBlock className="h-10 w-40" />
              </div>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
                <SkeletonBlock className="h-10 lg:col-span-4" />
                <SkeletonBlock className="h-10 lg:col-span-2" />
                <SkeletonBlock className="h-10 lg:col-span-2" />
                <SkeletonBlock className="h-10 lg:col-span-2" />
                <SkeletonBlock className="h-10 lg:col-span-2" />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4 sm:p-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#E5E7EB] bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-6"
              >
                <div className="space-y-5">
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <SkeletonBlock className="h-6 w-20 rounded-full" />
                        <SkeletonBlock className="h-6 w-28 rounded-full" />
                      </div>
                      <SkeletonBlock className="h-7 w-64 max-w-full" />
                      <SkeletonBlock className="h-4 w-80 max-w-full" />
                    </div>
                    <div className="flex gap-2">
                      <SkeletonBlock className="h-10 w-36" />
                      <SkeletonBlock className="h-10 w-10" />
                    </div>
                  </div>
                  <div className="grid gap-4 xl:grid-cols-[1.15fr_1.15fr_1fr]">
                    <SkeletonBlock className="h-48" />
                    <SkeletonBlock className="h-48" />
                    <SkeletonBlock className="h-48" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
