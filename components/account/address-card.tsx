"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { deleteUserAddress, setDefaultAddress } from "@/lib/actions/addresses";
import { useTransition } from "react";
import { toast } from "sonner";
import { AddressDialog } from "./address-dialog";
import { useState } from "react";

interface Address {
    id: string;
    name: string;
    street: string;
    exteriorNumber: string | null;
    interiorNumber: string | null;
    neighborhood: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string | null;
    isDefault: boolean | null;
}

interface AddressCardProps {
    address: Address;
}

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
import { useRouter } from "next/navigation";

export function AddressCard({ address }: AddressCardProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleDelete = () => {
        startTransition(async () => {
            try {
                console.log("Deleting address client-side:", address.id);
                await deleteUserAddress(address.id);
                toast.success("Address deleted successfully");
                router.refresh();
            } catch (error) {
                console.error("Delete failed client-side:", error);
                toast.error("Failed to delete address");
            }
        });
    };

    const handleSetDefault = () => {
        startTransition(async () => {
            try {
                await setDefaultAddress(address.id);
                toast.success("Default address updated");
            } catch (error) {
                toast.error("Failed to update default address");
            }
        });
    };

    return (
        <Card className={`relative ${address.isDefault ? "border-black shadow-sm" : ""}`}>
            {address.isDefault && (
                <div className="absolute top-4 right-4 text-green-600 flex items-center text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Default
                </div>
            )}
            <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                        <h3 className="font-medium font-times-now text-lg">{address.name}</h3>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="pl-8 space-y-1 text-sm text-gray-600 font-univers">
                    <p>
                        {address.street} {address.exteriorNumber}
                        {address.interiorNumber ? ` Int. ${address.interiorNumber}` : ""}
                    </p>
                    {address.neighborhood && <p>{address.neighborhood}</p>}
                    <p>
                        {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                    {address.phone && <p className="mt-2 text-gray-500">Tel: {address.phone}</p>}
                </div>

                <div className="pl-8 mt-4 flex gap-3">
                    <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                        <Pencil className="h-3 w-3 mr-2" />
                        Edit
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={isPending}
                            >
                                <Trash2 className="h-3 w-3 mr-2" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Address</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this address? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {!address.isDefault && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSetDefault}
                            disabled={isPending}
                        >
                            Set as Default
                        </Button>
                    )}
                </div>
            </CardContent>

            <AddressDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                addressToEdit={address}
            />
        </Card>
    );
}
