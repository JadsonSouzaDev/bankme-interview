"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { toast } from "sonner";
import { payableService } from "@/services/payable.service";
import { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PayableDto } from "@bankme/shared";

interface DeletePayableModalProps {
  payable: PayableDto;
}

const DeletePayableModal = ({ payable }: DeletePayableModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await payableService.delete(payable.id);
      toast.success("Payable deleted successfully!");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Error deleting payable");
      } else {
        toast.error("An error occurred while deleting the payable");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer text-sm text-red-500 hover:underline font-bold">
          Delete
        </span>
      </DialogTrigger>

      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Delete Payable</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this payable:{" "}
            <span className="font-bold">{payable.id}</span>? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Payable"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePayableModal;
