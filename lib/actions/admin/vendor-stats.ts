"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { sql, eq, and, ne } from "drizzle-orm";

export type SalesStat = {
  period: string;
  total: number;
  count: number;
};

export type VendorSalesStats = {
  daily: SalesStat[];
  monthly: SalesStat[];
  yearly: SalesStat[];
};

export async function getVendorSalesStats(vendorId: string): Promise<VendorSalesStats> {
  try {
    // Daily Sales (Last 30 days)
    const dailyStats = await db.execute(sql`
      SELECT 
        TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD') as period,
        SUM(${orders.total}) as total,
        COUNT(*) as count
      FROM ${orders}
      WHERE ${orders.vendorId} = ${vendorId}
      AND ${orders.status} != 'cancelled'
      AND ${orders.createdAt} >= NOW() - INTERVAL '30 days'
      GROUP BY TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')
      ORDER BY period DESC
    `);

    // Monthly Sales (Last 12 months)
    const monthlyStats = await db.execute(sql`
      SELECT 
        TO_CHAR(${orders.createdAt}, 'YYYY-MM') as period,
        SUM(${orders.total}) as total,
        COUNT(*) as count
      FROM ${orders}
      WHERE ${orders.vendorId} = ${vendorId}
      AND ${orders.status} != 'cancelled'
      AND ${orders.createdAt} >= NOW() - INTERVAL '12 months'
      GROUP BY TO_CHAR(${orders.createdAt}, 'YYYY-MM')
      ORDER BY period DESC
    `);

    // Yearly Sales (All time)
    const yearlyStats = await db.execute(sql`
      SELECT 
        TO_CHAR(${orders.createdAt}, 'YYYY') as period,
        SUM(${orders.total}) as total,
        COUNT(*) as count
      FROM ${orders}
      WHERE ${orders.vendorId} = ${vendorId}
      AND ${orders.status} != 'cancelled'
      GROUP BY TO_CHAR(${orders.createdAt}, 'YYYY')
      ORDER BY period DESC
    `);

    return {
      daily: (dailyStats as unknown as any[]).map(row => ({
        period: row.period as string,
        total: Number(row.total),
        count: Number(row.count)
      })),
      monthly: (monthlyStats as unknown as any[]).map(row => ({
        period: row.period as string,
        total: Number(row.total),
        count: Number(row.count)
      })),
      yearly: (yearlyStats as unknown as any[]).map(row => ({
        period: row.period as string,
        total: Number(row.total),
        count: Number(row.count)
      }))
    };
  } catch (error) {
    console.error("Error fetching vendor sales stats:", error);
    return { daily: [], monthly: [], yearly: [] };
  }
}
