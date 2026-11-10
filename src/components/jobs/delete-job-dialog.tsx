"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteJob } from "@/lib/api/jobs";
import { toast } from "../ui/toast";

/**
 * Trash icon trigger + destructive confirmation dialog for one job post.
 * On confirm it calls DELETE /jobs/:id and refreshes the server page data.
 */
export function DeleteJobDialog({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const router = useRouter(); // Router for page refresh 
  
  const [open, setOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleDelete() {
    // const res = await deleteJob(jobId)
    // console.log('Deleting', jobId, res);

    setDeleting(true);
    setError(null);
    try {
      await deleteJob(jobId);
      setOpen(false);
      toast.add({
        title: "Job Deleted",
        description: "This job has been permanently deleted.",
      })
      // Re-run the server component so the removed row disappears.
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong while deleting."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            title={`Delete "${jobTitle}"`}
            className="size-8 rounded-lg text-zinc-500 hover:bg-white/5 hover:text-red-400"
          />
        }
      >
        <Trash2Icon className="size-4" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Delete this job post?</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Are you sure you want to delete?{" "}
            <span className="font-medium text-white">“{jobTitle}”</span>. This
            will permanently remove the listing, and this action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleting}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg"
          >
            {deleting ? "Deleting…" : "Yes, delete job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
