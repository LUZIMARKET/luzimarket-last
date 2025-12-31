"use server";

import { db } from "@/db";
import { products, categories, vendors } from "@/db/schema";
import { sql } from "drizzle-orm";
import { ProductFilters, ProductWithRelations } from "./products";

// Helper to map raw snake_case rows to camelCase application model
function mapRawProduct(row: any): ProductWithRelations {
    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        price: row.price, // decimal string
        images: row.images || [],
        tags: row.tags || [],
        isActive: row.is_active,
        stock: row.stock,
        // Joined relations
        category: row.c_id ? {
            id: row.c_id,
            name: row.c_name,
            slug: row.c_slug
        } : null,
        vendor: row.v_id ? {
            id: row.v_id,
            businessName: row.v_business_name
        } : null
    };
}

export async function getFilteredProductsHandpicked(filters: ProductFilters = {}) {
    try {
        const {
            limit = 12,
            page = 1,
            tags = []
        } = filters;

        console.log("[Handpicked] Fetching products (Raw SQL) with tags:", tags);

        const offset = (page - 1) * limit;

        // Construct WHERE clause
        // We use sql.raw or composition. Drizzle sql`...` supports values.
        const chunks = [];
        chunks.push(sql`WHERE p.is_active = true`);

        // Tag filtering
        if (tags.length > 0) {
            // (position(tag1 in tags) > 0 OR position(tag2 in tags) > 0)
            const tagConditions = [];
            for (const tag of tags) {
                tagConditions.push(sql`position(${tag} in p.tags::text) > 0`);
            }
            // Join with OR
            if (tagConditions.length > 0) {
                const orClause = sql`(`;
                tagConditions.forEach((cond, idx) => {
                    if (idx > 0) orClause.append(sql` OR `);
                    orClause.append(cond);
                });
                orClause.append(sql`)`);
                chunks.push(sql` AND `);
                chunks.push(orClause);
            }
        }

        // Build the Main Query
        const query = sql`
      SELECT 
        p.*,
        c.id as c_id, c.name as c_name, c.slug as c_slug,
        v.id as v_id, v.business_name as v_business_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN vendors v ON p.vendor_id = v.id
    `;

        // Append WHERE chunks
        chunks.forEach(chunk => query.append(chunk));

        // Append Order/Limit
        // Append Order/Limit
        // Handle Sorting
        switch (filters.sortBy) {
            case 'price-asc':
                query.append(sql` ORDER BY CAST(p.price AS DECIMAL) ASC`);
                break;
            case 'price-desc':
                query.append(sql` ORDER BY CAST(p.price AS DECIMAL) DESC`);
                break;
            case 'newest':
                query.append(sql` ORDER BY p.created_at DESC`);
                break;
            default: // 'featured' or undefined
                // For handpicked, maybe random or by creation? Defaulting to newest for now or a specific 'handpicked' order if we had one.
                // Let's stick to created_at DESC as default "Nuestra selección" implying curation updates, or just ID.
                query.append(sql` ORDER BY p.created_at DESC`);
        }

        query.append(sql` LIMIT ${limit} OFFSET ${offset}`);

        // Build Count Query
        const countQuery = sql`SELECT count(*) as count FROM products p `;
        chunks.forEach(chunk => countQuery.append(chunk));

        // Execute
        // Note: db.execute returns a generic result. Typed via mapRawProduct.
        const [rows, countResult] = await Promise.all([
            db.execute(query),
            db.execute(countQuery)
        ]);

        const formattedProducts = rows.map(mapRawProduct);
        const totalCount = Number(countResult[0]?.count || 0);
        const totalPages = Math.ceil(totalCount / limit);

        return {
            products: formattedProducts,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            }
        };

    } catch (error) {
        console.error("Error in getFilteredProductsHandpicked (Raw SQL):", error);
        // Return empty result instead of throwing, to prevent page crash
        return {
            products: [],
            pagination: {
                page: 1, limit: 12, totalCount: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false
            }
        };
    }
}
