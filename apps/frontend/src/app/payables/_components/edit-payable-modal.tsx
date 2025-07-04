"use client";

import {
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  CurrencyInput,
} from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { payableService } from "@/services/payable.service";
import { assignorsService } from "@/services/assignors.service";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AssignorDto, PayableDto } from "@bankme/shared";

const updatePayableSchema = z.object({
  value: z
    .number({ required_error: "Value is required" })
    .min(0.01, "Value must be greater than 0"),
  emissionDate: z
    .string()
    .min(1, "Emission date is required")
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  assignor: z
    .string()
    .min(1, "Assignor is required")
    .uuid("Assignor must be a valid UUID"),
});

type UpdatePayableFormData = z.infer<typeof updatePayableSchema>;

interface EditPayableModalProps {
  payable: PayableDto;
}

const EditPayableModal = ({ payable }: EditPayableModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [assignors, setAssignors] = useState<AssignorDto[]>([]);
  const [isLoadingAssignors, setIsLoadingAssignors] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<UpdatePayableFormData>({
    resolver: zodResolver(updatePayableSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (isOpen) {
      loadAssignors();
      setValue("value", payable.value);
      setValue(
        "emissionDate",
        new Date(payable.emissionDate).toISOString().split("T")[0]
      );
    }
  }, [isOpen, payable, setValue]);

  useEffect(() => {
    if (isOpen && assignors.length > 0) {
      setValue("assignor", payable.assignorId);
    }
  }, [isOpen, assignors, payable.assignorId, setValue]);

  const loadAssignors = async () => {
    try {
      setIsLoadingAssignors(true);
      const response = await assignorsService.getAll();
      setAssignors(response.assignors);
    } catch (error) {
      console.error("Error loading assignors:", error);
      toast.error("Failed to load assignors");
    } finally {
      setIsLoadingAssignors(false);
    }
  };

  const onSubmit = async (data: UpdatePayableFormData) => {
    try {
      await payableService.update(payable.id, data);
      toast.success("Payable updated successfully!");
      setIsOpen(false);
      reset();
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Error updating payable");
      } else {
        toast.error("An error occurred while updating the payable");
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer text-sm text-blue-500 hover:underline font-bold">
          Edit
        </span>
      </DialogTrigger>

      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Edit Payable</DialogTitle>
          <DialogDescription>Update the payable information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="value">Value</Label>
            <CurrencyInput
              id="value"
              value={watch("value")}
              onChange={(value) => setValue("value", value)}
              error={!!errors.value}
              className="mt-1"
            />
            {errors.value && (
              <p className="text-red-500 text-xs mt-1">
                {errors.value.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="emissionDate">Emission Date</Label>
            <Input
              id="emissionDate"
              type="date"
              {...register("emissionDate")}
              className="mt-1"
            />
            {errors.emissionDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.emissionDate.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="assignor">Assignor</Label>
            <select
              id="assignor"
              {...register("assignor")}
              className="mt-1 w-full px-3 py-1 border border-blue-500 rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoadingAssignors}
            >
              <option value="">Select an assignor</option>
              {assignors.map((assignor) => (
                <option key={assignor.id} value={assignor.id}>
                  {assignor.name} - {assignor.email}
                </option>
              ))}
            </select>
            {errors.assignor && (
              <p className="text-red-500 text-xs mt-1">
                {errors.assignor.message}
              </p>
            )}
            {isLoadingAssignors && (
              <p className="text-gray-500 text-xs mt-1">Loading assignors...</p>
            )}
            {!isLoadingAssignors && assignors.length === 0 && (
              <p className="text-gray-500 text-xs mt-1">
                No assignors available
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Payable"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPayableModal;
