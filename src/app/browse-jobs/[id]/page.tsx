import Link from "next/link";

import { getJobById } from "@/lib/api/jobs";
import { JobCard } from "@/app/components/JobCard";

/**
 * Job Details (/browse-jobs/[id]): fetches one job by id and renders it
 * through the JobCard component (job passed as props).
 */
export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);

  return (
    <div className="dark min-h-screen bg-[#0b0b0f] p-4 text-white sm:p-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <Link
          href="/browse-jobs"
          className="text-sm text-zinc-400 transition-colors hover:text-white"
        >
          ← Back to Browse Jobs
        </Link>

        {job && job._id ? (
          <JobCard job={job} />
        ) : (
          <div className="rounded-xl bg-[#131317] p-10 text-center ring-1 ring-white/5">
            <p className="text-sm font-medium text-white">Job not found</p>
            <p className="mt-1 text-sm text-zinc-500">
              This listing may have been removed or never existed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
