"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    User,
    Mail,
    Calendar,
    ShoppingCart,
    ArrowLeft,
    MapPin,
    Phone,
    Clock,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "@/lib/actions/admin/users";
import { getVendorSalesStats, type VendorSalesStats } from "@/lib/actions/admin/vendor-stats";
import { useTranslations } from "next-intl";

type UserDetailData = {
    id: string;
    name: string | null;
    email: string;
    createdAt: Date | null;
    orderCount: number;
    totalSpent: number;
    userType: string;
    lastLoginAt?: Date | null;
    phone?: string | null;
    address?: string | null;
};

type ActivityItem = {
    id: string;
    action: string;
    description: string;
    timestamp: Date;
    ipAddress?: string;
};

export default function UserDetailPage() {
    const t = useTranslations("Admin");
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const [activeTab, setActiveTab] = useState<string>("info");

    const { data: users = [], isLoading: isLoadingUser, error } = useQuery({
        queryKey: ["admin", "users"],
        queryFn: getAdminUsers,
        staleTime: 60 * 1000,
    });

    const user = users.find((u) => u.id === userId) as unknown as UserDetailData | undefined;
    const isVendor = user?.userType === 'vendor';

    const { data: salesStats } = useQuery({
        queryKey: ["admin", "vendor-stats", userId],
        queryFn: () => getVendorSalesStats(userId),
        enabled: !!isVendor,
    });

    const activities: ActivityItem[] = [];

    if (isLoadingUser) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/users">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {t("usersPage.viewDetails")}
                        </Button>
                    </Link>
                </div>
                <div className="text-center py-8">
                    <p className="text-red-600 font-univers">{'Usuario no encontrado'}</p>
                </div>
            </div>
        );
    }

    const renderSalesTable = (title: string, data: any[]) => (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h4 className="text-sm font-semibold font-univers text-gray-900">{title}</h4>
            </div>
            {data && data.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm font-univers">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-gray-500 font-medium">{t("salesReport.columns.period")}</th>
                                <th className="px-4 py-2 text-right text-gray-500 font-medium">{t("salesReport.columns.sales")}</th>
                                <th className="px-4 py-2 text-right text-gray-500 font-medium">{t("salesReport.columns.total")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((item) => (
                                <tr key={item.period} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-gray-900">{item.period}</td>
                                    <td className="px-4 py-2 text-right text-gray-600">{item.count}</td>
                                    <td className="px-4 py-2 text-right text-green-600 font-medium">
                                        ${item.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-4 text-center text-gray-500 text-sm">{t("salesReport.noData")}</div>
            )}
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/users">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {t("usersPage.viewDetails")}
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-univers text-gray-900">
                            {user.name || t("userDetail.noName")}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <p className="text-sm text-gray-600 font-univers">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-univers ${user.userType === 'admin' ? 'bg-red-100 text-red-800' :
                        user.userType === 'vendor' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                        {user.userType === 'admin' ? t("usersPage.userTypes.admin_role") :
                            user.userType === 'vendor' ? t("usersPage.userTypes.vendor_role") :
                                t("usersPage.userTypes.customer")}
                    </span>
                    <Link href={`/admin/users/${userId}/edit`}>
                        <Button size="sm" variant="outline">Editar</Button>
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        <button
                            role="tab"
                            onClick={() => setActiveTab("info")}
                            className={`py-4 px-1 text-sm font-univers border-b-2 transition-colors ${activeTab === "info"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {t("userDetail.info")}
                        </button>
                        <button
                            role="tab"
                            onClick={() => setActiveTab("activity")}
                            className={`py-4 px-1 text-sm font-univers border-b-2 transition-colors ${activeTab === "activity"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {isVendor ? t("userDetail.salesReport") : t("userDetail.activity")}
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === "info" && (
                        <div className="space-y-6">
                            {/* User stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <ShoppingCart className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <p className="text-sm font-univers text-gray-600">{isVendor ? t("userDetail.products") : t("userDetail.totalOrders")}</p>
                                            <p className="text-2xl font-univers font-semibold text-gray-900">{user.orderCount}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-green-500" />
                                        <div>
                                            <p className="text-sm font-univers text-gray-600">{isVendor ? t("userDetail.totalSales") : t("userDetail.totalSpent")}</p>
                                            <p className="text-2xl font-univers font-semibold text-gray-900">
                                                ${Number(user.totalSpent).toLocaleString('es-MX')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-purple-500" />
                                        <div>
                                            <p className="text-sm font-univers text-gray-600">{t("userDetail.lastAccess")}</p>
                                            <p className="text-sm font-univers font-semibold text-gray-900">
                                                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('es-MX') : t("userDetail.never")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-univers text-gray-900 mb-4">{t("userDetail.userDetails")}</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <User className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-univers text-gray-600">{t("userDetail.name")}</p>
                                                <p className="text-sm font-univers text-gray-900">{user.name || t("userDetail.noName")}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-univers text-gray-600">{t("userDetail.email")}</p>
                                                <p className="text-sm font-univers text-gray-900">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-univers text-gray-600">{t("userDetail.phone")}</p>
                                                <p className="text-sm font-univers text-gray-900">{user.phone || t("userDetail.notAvailable")}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-univers text-gray-600">{t("userDetail.address")}</p>
                                                <p className="text-sm font-univers text-gray-900">{user.address || t("userDetail.notAvailable")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-univers text-gray-900 mb-4">{t("userDetail.accountInfo")}</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-univers text-gray-600">{t("userDetail.registrationDate")}</p>
                                                <p className="text-sm font-univers text-gray-900">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-MX') : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "activity" && (
                        <div className="space-y-6">
                            {isVendor ? (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-univers text-gray-900">{t("userDetail.salesHistory")}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Activity className="h-4 w-4" />
                                            <span>{t("userDetail.salesRealtime")}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {renderSalesTable(t("salesReport.periods.daily"), salesStats?.daily || [])}
                                        {renderSalesTable(t("salesReport.periods.monthly"), salesStats?.monthly || [])}
                                        {renderSalesTable(t("salesReport.periods.yearly"), salesStats?.yearly || [])}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 font-univers">{t("userDetail.noActivityCustomer")}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}