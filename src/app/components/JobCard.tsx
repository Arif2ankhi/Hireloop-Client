"use client";

import * as React from "react";
import type { ReactNode } from "react";
import { createElement } from "react";
import {
  BanknoteIcon,
  BookmarkIcon,
  BriefcaseIcon,
  Building2Icon,
  CalendarIcon,
  GlobeIcon,
  PinIcon,
} from "lucide-react";

import type { JobFormData } from "@/lib/types/job-form-data";
import type { JobApplication } from "@/types/applications";
import { formatCompact, formatDeadline, formatFrequency, formatLocationWithCountry, getDeptIcon } from "@/lib/jobs/display";
import { createApplication, getApplicationsCount } from "@/lib/actions/applications";
import { useSession } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

/** Small dark pill chip used across the header info row. */
function Chip({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#1a1a20] px-2.5 py-1 text-xs text-zinc-300">
      {icon}
      {children}
    </span>
  );
}

/** Titled content panel for Responsibilities / Requirements sections. */
function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5 rounded-lg bg-[#1a1a20] p-4">
      <h2 className="text-sm font-medium text-white">{title}</h2>
      <p className="text-sm leading-relaxed whitespace-pre-line text-zinc-300">
        {children}
      </p>
    </section>
  );
}

/**
 * Detailed job card for the Job Details page (/browse-jobs/[id]): header
 * with Save + "Apply Now" on the right, key-facts row and detail sections.
 * Save toggles local state for now — persistence is the TODO inside.
 */
export function JobCard({ job }: { job: JobFormData }) {
  const [saved, setSaved] = React.useState(false);
  const [applied, setApplied] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSave = () => {
    // TODO: persist the bookmark for the signed-in user (backend isn't in
    // place yet) — for now this only toggles the visual state.
    setSaved(!saved);
  };

  // User session
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  const handleApplyNow = async () => {
    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-jobs/${job._id}`);
      return;
    }

    if (user.role !== "seeker" || !job._id || applied || submitting) return;

    // Free-tier cap: redirect to /payment once the seeker has applied to 10
    // jobs — premium users are exempt (flag set by the Stripe success page).
    const { count } = await getApplicationsCount(user.id);
    if (count >= 10 && !user.premium) {
      router.push("/payment");
      return;
    }

    // Full JobApplication snapshot: fields the My Applications table reads.
    const payload: Omit<JobApplication, "_id"> = {
      jobId: job._id,
      applicantId: user.id,
      applicantName: user.name,
      applicantEmail: user.email,
      title: job.title,
      companyName: job.companyName,
      category: job.category,
      type: job.type,
      isRemote: job.isRemote,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      frequency: job.frequency,
      status: "Applied",
      archived: false,
      appliedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      await createApplication(payload);
      setApplied(true);
      toast.add({
        title: "Application submitted",
        description: "Application submitted successfully",
        type: "success",
      });
    } catch {
      toast.add({
        title: "Application failed",
        description: "Could not submit the application. Try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isRemote = job.isRemote === "on";

  return (
    <article className="flex flex-col gap-5 rounded-2xl bg-[#131317] p-5 ring-1 ring-white/5 sm:p-6">
      {/* Header: icon, title, company • country-wise location, actions */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#1a1a20] text-brand">
            {/* createElement: call-safe way to resolve a dynamic lucide icon
                component (icons are forwardRef objects, not plain functions) */}
            {createElement(getDeptIcon(job.category), {
              className: "size-7",
            })}
          </span>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">
              {job.title}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <Building2Icon className="size-3.5" />
                {job.companyName}
              </span>
              <span aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-1.5">
                <PinIcon className="size-3.5" />
                {formatLocationWithCountry(job.location)}
                {isRemote ? " (Remote)" : ""}
              </span>
            </p>
          </div>
        </div>

        {/* Save + Apply Now, top-right per the mock */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved jobs" : "Save job"}
            title={saved ? "Saved" : "Save job"}
            onClick={handleSave}
            className="rounded-lg bg-[#1a1a20] p-2 text-zinc-400 transition-colors hover:text-white"
          >
            <BookmarkIcon
              className={saved ? "size-4.5 fill-brand text-brand" : "size-4.5"}
            />
          </button>
          <button
            type="button"
            onClick={handleApplyNow}
            disabled={applied || submitting}
            className="h-9 rounded-lg bg-white px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-300"
          >
            {applied ? "Applied" : submitting ? "Submitting…" : "Apply Now"}
          </button>
        </div>
      </div>

      {/* Key facts row */}
      <div className="flex flex-wrap gap-2">
        <Chip icon={<BanknoteIcon className="size-3.5" />}>
          {formatCompact(job.salaryMin)} – {formatCompact(job.salaryMax)}
          {formatFrequency(job.frequency)}
        </Chip>
        <Chip icon={<BriefcaseIcon className="size-3.5" />}>{job.type}</Chip>
        <Chip icon={<GlobeIcon className="size-3.5" />}>
          {isRemote ? "Remote" : "On-site"}
        </Chip>
        <Chip icon={<BriefcaseIcon className="size-3.5" />}>
          {job.category}
        </Chip>
        {job.deadline ? (
          <Chip icon={<CalendarIcon className="size-3.5" />}>
            Apply before {formatDeadline(job.deadline)}
          </Chip>
        ) : null}
      </div>

      {/* Detail sections */}
      {job.responsibilities ? (
        <InfoSection title="Key Responsibilities">
          {job.responsibilities}
        </InfoSection>
      ) : null}
      {job.requirements ? (
        <InfoSection title="Qualifications &amp; Requirements">
          {job.requirements}
        </InfoSection>
      ) : null}
    </article>
  );
}