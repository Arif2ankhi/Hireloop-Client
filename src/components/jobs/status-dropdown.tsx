"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { StatusBadge } from "@/components/jobs/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { updateApplicationStatus } from "@/lib/actions/applications";
import type { ApplicationStatus } from "@/types/applications";

/** Recruiter-selectable statuses, in pipeline order. */
const STATUS_OPTIONS: ApplicationStatus[] = [
  "Applied",
  "Review",
  "Interview",
  "Shortlisted",
  "Offered",
  "Rejected",
];

/**
 * The status pill acting as a dropdown: picking a status updates the
 * backend (PATCH /applications/:id/status), applies the change optimistically
 * and rolls it back with an error toast if the call fails. router.refresh()
 * re-renders the server page so the stat tiles stay in sync.
 */
export function StatusDropdown({
  applicationId,
  status,
}: {
  applicationId: string;
  status: ApplicationStatus;
}) {
  const router = useRouter();
  const [current, setCurrent] = React.useState(status);

  const handleSelect = async (next: ApplicationStatus) => {
    if (next === current) return;

    const previous = current;
    setCurrent(next); // optimistic — a one-field update needs no spinner
    try {
      await updateApplicationStatus(applicationId, next);
      toast.add({
        title: "Status updated",
        description: `Applicant moved to ${next}.`,
        type: "success",
      });
      // Server page re-renders (stat tiles recompute from fresh data).
      router.refresh();
    } catch {
      setCurrent(previous);
      toast.add({
        title: "Update failed",
        description: "Could not save the new status. Try again.",
        type: "error",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Change application status"
        className="inline-flex items-center gap-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
      >
        <StatusBadge status={current} />
        <ChevronDownIcon className="size-3.5 text-zinc-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-44 rounded-lg bg-[#1a1a20] p-1 ring-1 ring-white/10"
      >
        {STATUS_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => void handleSelect(option)}
            className="rounded-md px-2.5 py-1.5 text-sm text-zinc-300 focus:bg-white/5 focus:text-white data-highlighted:bg-white/5 data-highlighted:text-white"
          >
            <span className="flex-1">{option}</span>
            {option === current ? (
              <CheckIcon className="size-3.5 text-brand" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
