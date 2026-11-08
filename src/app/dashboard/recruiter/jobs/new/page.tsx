"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarIcon,
  GlobeIcon,
  MapPinIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { createJob } from "@/lib/actions/jobs";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const;

const CATEGORIES = [
  "Engineering & Tech",
  "Design",
  "Marketing",
  "Product",
  "Data & Analytics",
  "Other",
] as const;

const FREQUENCIES = ["per hour", "per day", "per month", "per year"] as const;

/** Shared bits */
function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="flex items-center gap-2 text-base font-semibold text-white">
      <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
      {children}
    </h2>
  );
}

function FieldLabel({
  htmlFor,
  requiredHint,
  children,
}: {
  htmlFor: string;
  requiredHint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label
        htmlFor={htmlFor}
        className="text-sm font-medium text-zinc-300 [&_span]:ml-0.5"
      >
        {children}
        <span className="text-brand">*</span>
      </Label>
      {requiredHint ? (
        <span className="text-xs text-zinc-500">{requiredHint}</span>
      ) : null}
    </div>
  );
}

export default function NewJobPage() {
  // The remote toggle only records the flag in FormData — the location field
  // is always enabled now, so only the setter is needed for the reset below.
  const [, setIsRemote] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const  handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    // TODO: POST this object to /api/jobs once the backend exists.
    console.log("new job", data);
    setSubmitted(true);
    form.reset();
    setIsRemote(false);

    // New way to fetch data  from lib/actions.ts

    const result = await createJob(data)
    console.log('createdJob result:', result);

  }

  return (
    <div className="dark min-h-screen bg-[#0b0b0f] p-6 text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Header */}
        <div>
          <p className="text-xs text-zinc-500">
            <Link href="/dashboard/recruiter/jobs" className="hover:text-zinc-300">
              Manage Jobs
            </Link>
            <span className="mx-1.5">›</span>
            <span className="text-zinc-300">Create New Listing</span>
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Post a New Job
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in the position specifications to attract qualified talent
            across our network.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* 1. Basic Information */}
          <section className="flex flex-col gap-5 rounded-xl bg-[#131317] p-6">
            <SectionHeading>1. Basic Information</SectionHeading>

            {/* Job Title */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="title">Job Title</FieldLabel>
              <Input
                id="title"
                name="title"
                placeholder="Frontend Developer"
                className="border-white/10 bg-[#1a1a20] text-white placeholder:text-zinc-500"
                required
              />
            </div>

            {/* Company Name + Job Category */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="HirePulse Network"
                    className="border-white/10 bg-[#1a1a20] pl-9 text-white placeholder:text-zinc-500"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="category">Job Category</FieldLabel>
                <NativeSelect
                  id="category"
                  name="category"
                  defaultValue=""
                  className="w-full"
                  required
                >
                  <NativeSelectOption value="" disabled>
                    Select a category
                  </NativeSelectOption>
                  {CATEGORIES.map((category) => (
                    <NativeSelectOption key={category} value={category}>
                      {category}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
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
          <section className="flex flex-col gap-5 rounded-xl bg-[#131317] p-6">
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
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="location" requiredHint="Optional">
                  Job Location (location)
                </FieldLabel>
                <div className="relative">
                  <MapPinIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="location"
                    name="location"
                    placeholder="New York, USA"
                    className="border-white/10 bg-[#1a1a20] pl-9 text-white placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="deadline">Application Deadline (deadline)</FieldLabel>
                <div className="relative">
                  <CalendarIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    className="border-white/10 bg-[#1a1a20] pl-9 pr-2 text-white [color-scheme:dark]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Salary + Frequency */}
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="salaryMin">Min Salary / Rate</FieldLabel>
                <Input
                  id="salaryMin"
                  name="salaryMin"
                  type="number"
                  min="0"
                  placeholder="€ 25"
                  className="border-white/10 bg-[#1a1a20] text-white placeholder:text-zinc-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="salaryMax">Max Salary / Rate</FieldLabel>
                <Input
                  id="salaryMax"
                  name="salaryMax"
                  type="number"
                  min="0"
                  placeholder="€ 40"
                  className="border-white/10 bg-[#1a1a20] text-white placeholder:text-zinc-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="frequency"
                  className="text-sm font-medium text-zinc-300"
                >
                  Frequency
                </Label>
                <NativeSelect
                  id="frequency"
                  name="frequency"
                  defaultValue={FREQUENCIES[0]}
                  className="w-full"
                >
                  {FREQUENCIES.map((frequency) => (
                    <NativeSelectOption key={frequency} value={frequency}>
                      {frequency}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
            </div>
          </section>

          {/* 3. Responsibilities & Requirements */}
          <section className="flex flex-col gap-5 rounded-xl bg-[#131317] p-6">
            <SectionHeading>3. Responsibilities &amp; Requirements</SectionHeading>

            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="responsibilities">Key Responsibilities</FieldLabel>
              <Textarea
                id="responsibilities"
                name="responsibilities"
                rows={4}
                placeholder="Showcase your commitment to delivering exceptional user interfaces and digital experiences. You will collaborate directly with systems designers and backend engineers to craft responsive, micro-interaction rich products."
                className="border-white/10 bg-[#1a1a20] text-white placeholder:text-zinc-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="requirements">Qualifications &amp; Requirements</FieldLabel>
              <Textarea
                id="requirements"
                name="requirements"
                rows={4}
                placeholder={"• 3+ years of experience with React, TypeScript, and modern state architectures\n• Solid understanding of DOM performance and component-driven designs\n• Experience partnering closely with product teams and UI/UX designers"}
                className="border-white/10 bg-[#1a1a20] text-white placeholder:text-zinc-500"
                required
              />
            </div>
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
            {submitted ? (
              <p className="text-sm text-zinc-400">
                Job data captured — see the console for the collected object
                (API wiring comes next).
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
