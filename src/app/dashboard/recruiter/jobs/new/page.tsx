"use client";

import * as React from "react";
import {
  ArrowRight,
  Building2,
  CalendarIcon,
  GlobeIcon,
  MapPinIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  FieldLabel,
  SectionHeading,
  SelectField,
  TextField,
  TextareaField,
} from "@/components/jobs/form-fields";
import { DarkPage, PageHeader } from "@/components/layout/page";
import { createJob } from "@/lib/actions/jobs";
import {
  JOB_CATEGORIES as CATEGORIES,
  JOB_TYPES,
  PAY_FREQUENCIES as FREQUENCIES,
} from "@/lib/types/job-form-data";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function NewJobPage() {
  // The remote toggle only records the flag in FormData — the location field
  // is always enabled now, so only the setter is needed for the reset below.
  const [, setIsRemote] = React.useState(false);

  const router = useRouter();
  // Signed-in recruiter — the job's recruiterId comes from the session,
  // never from the form (a client-editable field would let anyone post
  // listings under another recruiter's id).
  const { data: session } = useSession();
  const user = session?.user;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      // No session → no recruiterId → cannot create the job.
      router.push("/sign-in?redirectTo=/dashboard/recruiter/jobs/new");
      return;
    }

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    try {
      await createJob({ ...data, recruiterId: user.id });
      toast.add({
        title: "Job Created",
        description: "This job has been added successfully.",
        type: "success",
      });
      form.reset();
      setIsRemote(false);
      router.push("/dashboard/recruiter/jobs");
    } catch {
      toast.add({
        title: "Job creation failed",
        description: "Could not publish the job. Try again.",
        type: "error",
      });
    }
  };

  return (
    <DarkPage>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <PageHeader
          items={[
            { label: "Manage Jobs", href: "/dashboard/recruiter/jobs" },
            { label: "Create New Listing" },
          ]}
          title="Post a New Job"
          description="Fill in the position specifications to attract qualified talent across our network."
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* 1. Basic Information */}
          <section className="flex flex-col gap-5 rounded-xl bg-[#131317] p-4 sm:p-6">
            <SectionHeading>1. Basic Information</SectionHeading>

            <TextField
              id="title"
              name="title"
              label="Job Title"
              placeholder="Frontend Developer"
              required
            />

            {/* Company Name + Job Category */}
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                id="companyName"
                name="companyName"
                label="Company Name"
                icon={Building2}
                placeholder="HirePulse Network"
                required
              />

              <SelectField
                id="category"
                name="category"
                label="Job Category"
                options={CATEGORIES}
                placeholder="Select a category"
                defaultValue=""
                required
              />
            </div>

            {/* Job Type chips (native radios → `type` rides in FormData) */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="type">Job Type</FieldLabel>
              <div
                role="radiogroup"
                className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                id="type"
              >
                {JOB_TYPES.map((type, index) => (
                  <label key={type} className="cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      defaultChecked={index === 0}
                      className="peer sr-only"
                    />
                    <span className="flex items-center justify-center rounded-lg border border-white/10 bg-[#1a1a20] px-3.5 py-2.5 text-sm text-zinc-300 transition-colors peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 peer-checked:border-brand peer-checked:bg-brand/15 peer-checked:text-white hover:text-white">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Location, Compensation & Timeline */}
          <section className="flex flex-col gap-5 rounded-xl bg-[#131317] p-4 sm:p-6">
            <SectionHeading>2. Location, Compensation &amp; Timeline</SectionHeading>

            {/* Remote toggle card (native checkbox → `isRemote` in FormData) */}
            <label className="flex cursor-pointer items-center justify-between rounded-xl bg-[#1a1a20] px-4 py-3.5">
              <span className="flex items-center gap-3">
                <GlobeIcon className="size-5 text-brand" />
                <span>
                  <span className="block text-sm font-medium text-white">
                    Remote Work Allowed (isRemote)
                  </span>
                  <span className="block text-xs text-zinc-500">
                    Enable worldwide or distributed candidate applications
                  </span>
                </span>
              </span>
              <span className="relative inline-flex">
                <input
                  type="checkbox"
                  name="isRemote"
                  onChange={(event) => setIsRemote(event.target.checked)}
                  className="peer sr-only"
                />
                <span className="relative h-6 w-11 rounded-full bg-zinc-700 transition-colors peer-checked:bg-brand" />
                <span className="absolute top-0 left-0 size-6 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </span>
            </label>

            {/* Location + Deadline */}
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                id="location"
                name="location"
                label="Job Location (location)"
                requiredHint="Optional"
                icon={MapPinIcon}
                placeholder="New York, USA"
              />

              <TextField
                id="deadline"
                name="deadline"
                label="Application Deadline (deadline)"
                icon={CalendarIcon}
                type="date"
                className="pr-2 [color-scheme:dark]"
                required
              />
            </div>

            {/* Salary + Frequency */}
            <div className="grid gap-5 sm:grid-cols-3">
              <TextField
                id="salaryMin"
                name="salaryMin"
                label="Min Salary / Rate"
                type="number"
                min={0}
                placeholder="€ 25"
                required
              />
              <TextField
                id="salaryMax"
                name="salaryMax"
                label="Max Salary / Rate"
                type="number"
                min={0}
                placeholder="€ 40"
                required
              />
              <SelectField
                id="frequency"
                name="frequency"
                label="Frequency"
                options={FREQUENCIES}
                defaultValue={FREQUENCIES[0]}
                required={false}
              />
            </div>
          </section>

          {/* 3. Responsibilities & Requirements */}
          <section className="flex flex-col gap-5 rounded-xl bg-[#131317] p-4 sm:p-6">
            <SectionHeading>3. Responsibilities &amp; Requirements</SectionHeading>

            <TextareaField
              id="responsibilities"
              name="responsibilities"
              label="Key Responsibilities"
              rows={4}
              placeholder="Showcase your commitment to delivering exceptional user interfaces and digital experiences. You will collaborate directly with systems designers and backend engineers to craft responsive, micro-interaction rich products."
              required
            />

            <TextareaField
              id="requirements"
              name="requirements"
              label="Qualifications &amp; Requirements"
              rows={4}
              placeholder={"• 3+ years of experience with React, TypeScript, and modern state architectures\n• Solid understanding of DOM performance and component-driven designs\n• Experience partnering closely with product teams and UI/UX designers"}
              required
            />
          </section>

          {/* Publish — bottom, per the design request */}
          <div className="flex items-center gap-4 pb-6">
            <Button
              type="submit"
              className="h-11 rounded-full bg-brand px-6 text-sm font-medium text-white hover:bg-brand/90"
            >
              Publish Job
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </form>
      </div>
    </DarkPage>
  );
}
