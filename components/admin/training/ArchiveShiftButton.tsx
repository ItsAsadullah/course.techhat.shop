"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { archiveTrainingShift } from "@/lib/admin/actions/training-shifts";
import { toast } from "sonner";
import { Archive, Loader2 } from "lucide-react";

interface Props {
  shiftId: string;
  shiftName: string;
}

export function ArchiveShiftButton({ shiftId, shiftName }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleArchive(e: React.MouseEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await archiveTrainingShift(shiftId);
      if (result.success) {
        toast.success("Shift archived successfully");
        router.push("/admin/training/shifts");
      } else {
        toast.error(result.error.message);
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2">
          <Archive className="h-4 w-4" />
          Archive Shift
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive Training Shift</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to archive {shiftName}? This action will hide it from normal view. It will be blocked if there are active dependencies.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleArchive} disabled={isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Archive
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
