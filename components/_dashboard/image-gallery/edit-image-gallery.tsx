"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const formSchema = z.object({
  categoryName: z.string().min(1, "Category is required"),
  subCategoryName: z.string().min(1, "Sub-category is required"),
  image: z.any().optional(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import ImageUpload from "@/components/ui/ImageUpload";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CategoryApiResponse,
  CategoryImage,
} from "@/components/types/ImageGallery";
import { toast } from "react-toastify";


const EditImageGallery = ({
  open,
  onOpenChange,
  defaultData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultData?: CategoryImage;
}) => {
  const [image, setImage] = useState<File | null>(null);
  console.log(image);

  console.log("defaultData", defaultData);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBhMDkyMDA0MDM1ZTdhOGNjOTc4ZTUiLCJpYXQiOjE3NDU0ODgzNzMsImV4cCI6MTc0NjA5MzE3M30.yifJ6Nn-zzQyFHGBCuXEDsk-vPazqGd55WNNNV7ZcdI";

  const queryClient = useQueryClient();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: defaultData?.categoryName || "",
      subCategoryName: defaultData?.subcategoryName || "",
    },
  });

  // get category and subCategory
  const { data } = useQuery<CategoryApiResponse>({
    queryKey: ["all-category-subCategory"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-category-and-subcategory-names`,
        { headers: { Authorization: `Bearer ${token}` } }
      ).then((res) => res.json()),
  });

  const categoryData = data?.data || [];
  const allSubCategories = categoryData.flatMap(
    (item) => item.subCategoryNames
  );
  console.log(defaultData?.categoryId);

  // create image category edit
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-image-gallery"],
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/update-category/${defaultData?.categoryId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`, // Don't include Content-Type for FormData
          },
          body: formData,
        }
      );
      return res.json();
    },

    onSuccess: (data) => {
      if (!data?.status) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Image gallery updated successfully");
      queryClient.invalidateQueries({ queryKey: ["all-image-gallery"] });
      onOpenChange(false);
    },
  });

  const onSubmit = (values: CategoryFormValues) => {
    const formData = new FormData();
    formData.append("categoryName", values.categoryName);
    formData.append("subCategoryName", values.subCategoryName);
    if (image) {
      formData.append("image", image);
    }
    console.log("Submitted values:", formData);
    mutate(formData);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white/20 text-white p-0 rounded-2xl shadow-2xl border border-white/10 max-w-3xl">
          <DialogHeader className="">
            <div className="bg-[#7abfff]/10 rounded-[16px] ">
              <h2 className="bg-gradient-to-r from-[#8F37FF] to-[#2D17FF] rounded-t-[16px] text-[28px] font-semibold text-white leading-[120%] px-[40px] py-[22px]">
                Edit Image
              </h2>
            </div>
          </DialogHeader>
          <div className=" mt-[-18px] p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 bg-[#170A2C]/20 rounded-[16px] p-6"

              >
                {/* Category Name */}
                <FormField
                  control={form.control}
                  name="categoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-normal leading-[120%] text-[#F4EBFF]">
                        Category Name
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-[#9E9E9E] text-white">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryData?.map((cat, index) => (
                            <SelectItem key={index} value={cat.categoryName}>
                              {cat.categoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sub-category */}
                <FormField
                  control={form.control}
                  name="subCategoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-normal leading-[120%] text-[#F4EBFF]">
                        Sub-category
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-[#9E9E9E] text-white">
                            <SelectValue placeholder="Select a sub-category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allSubCategories?.map((cat, index) => (
                            <SelectItem key={index} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload */}

                <div>
                  <div className="pb-2">
                    <Label className="text-base font-normal leading-[120%] text-[#F4EBFF]">
                      Category Image
                    </Label>
                  </div>
                  <ImageUpload
                    onImageChange={setImage}
                    defaultImageUrl={defaultData?.image}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-purple-600 hover:bg-purple-500"
                >
                  {isPending ? "Uploading..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditImageGallery;
