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
} from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { assignorsService } from "@/services/assignors.service";
import { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

const createAssignorSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(140, "Name must be at most 140 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email must be valid")
    .max(140, "Email must be at most 140 characters"),
  document: z
    .string()
    .min(1, "Document is required")
    .min(7, "Document must be at least 7 characters")
    .max(30, "Document must be at most 30 characters"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .min(10, "Phone must be at least 10 characters")
    .max(20, "Phone must be at most 20 characters"),
});

type CreateAssignorFormData = z.infer<typeof createAssignorSchema>;

const CreateAssignorModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateAssignorFormData>({
    resolver: zodResolver(createAssignorSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: CreateAssignorFormData) => {
    try {
      await assignorsService.create(data);
      toast.success("Assignor created successfully!");
      setIsOpen(false);
      reset();
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Error creating assignor");
      } else {
        toast.error("An error occurred while creating the assignor");
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
        <Button size="sm" variant="outline">
          Add Assignor
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create Assignor</DialogTitle>
          <DialogDescription>
            Create a new assignor to your company.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter full name"
              className="mt-1"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              {...register("email")}
              type="email"
              placeholder="Enter email"
              className="mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="document">Document</Label>
            <Input
              id="document"
              {...register("document")}
              placeholder="Enter document (CPF/CNPJ)"
              className="mt-1"
            />
            {errors.document && (
              <p className="text-red-500 text-xs mt-1">
                {errors.document.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Enter phone number"
              className="mt-1"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone.message}
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
              {isSubmitting ? "Creating..." : "Create Assignor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssignorModal;
