"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createUserAddress, updateUserAddress } from "@/lib/actions/addresses";
import { toast } from "sonner";
import { useTransition, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getStateFromPostalCode } from "@/lib/utils/shipping-zones";

const addressSchema = z.object({
    name: z.string().min(1, "Recipient name is required"),
    street: z.string().min(1, "Street is required"),
    exteriorNumber: z.string().optional(),
    interiorNumber: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(5, "Valid postal code is required"),
    country: z.string().min(1, "Country is required"),
    phone: z.string().optional(),
    isDefault: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressPartial {
    id: string;
    name: string;
    street: string;
    exteriorNumber?: string | null;
    interiorNumber?: string | null;
    neighborhood?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string | null;
    isDefault?: boolean | null;
}

interface AddressDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    addressToEdit?: AddressPartial;
}

export function AddressDialog({ open, onOpenChange, addressToEdit }: AddressDialogProps) {
    const [isPending, startTransition] = useTransition();

    const form = useForm({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            name: addressToEdit?.name || "",
            street: addressToEdit?.street || "",
            exteriorNumber: addressToEdit?.exteriorNumber || "",
            interiorNumber: addressToEdit?.interiorNumber || "",
            neighborhood: addressToEdit?.neighborhood || "",
            city: addressToEdit?.city || "",
            state: addressToEdit?.state || "",
            postalCode: addressToEdit?.postalCode || "",
            country: addressToEdit?.country || "México",
            phone: addressToEdit?.phone || "",
            isDefault: addressToEdit?.isDefault ?? false,
        },
    });

    // Watch postal code to auto-fill state
    const postalCode = form.watch("postalCode");

    useEffect(() => {
        if (postalCode && postalCode.length === 5) {
            const state = getStateFromPostalCode(postalCode);
            if (state) {
                form.setValue("state", state);
                toast.info(`State passed to ${state}`);
            }
        }
    }, [postalCode, form]);

    const onSubmit = (data: AddressFormValues) => {
        startTransition(async () => {
            try {
                if (addressToEdit) {
                    await updateUserAddress(addressToEdit.id, data);
                    toast.success("Address updated successfully");
                } else {
                    await createUserAddress(data);
                    toast.success("Address added successfully");
                }
                onOpenChange(false);
                form.reset();
            } catch (error) {
                toast.error(addressToEdit ? "Failed to update address" : "Failed to create address");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-times-now text-2xl">
                        {addressToEdit ? "Edit Address" : "Add New Address"}
                    </DialogTitle>
                    <DialogDescription className="font-univers">
                        {addressToEdit
                            ? "Update your shipping address details below."
                            : "Enter your new shipping address details below."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recipient Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="street"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Street</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Av. Reforma" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="exteriorNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ext. Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. 123" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="interiorNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Int. Number (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. 2B" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="neighborhood"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Neighborhood (Colonia)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Juarez" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Mexico City" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. CDMX" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="postalCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Postal Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. 06600" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Mexico" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 555 123 4567" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isDefault"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Set as default address</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {addressToEdit ? "Save Changes" : "Add Address"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
