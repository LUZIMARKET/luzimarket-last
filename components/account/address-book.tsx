"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddressDialog } from "./address-dialog";
import { AddressCard } from "./address-card";

interface AddressBookProps {
    addresses: any[];
}

export function AddressBook({ addresses }: AddressBookProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-times-now">Saved Addresses</h2>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                </Button>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                    <p className="text-gray-500 font-univers mb-4">No addresses saved yet.</p>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
                        Add your first address
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <AddressCard key={address.id} address={address} />
                    ))}
                </div>
            )}

            <AddressDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
        </div>
    );
}
