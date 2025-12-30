
import { db } from './db';
import { sql } from 'drizzle-orm';

async function main() {
    console.log('Checking database tables...');

    try {
        // Check products table
        console.log('\nChecking products table columns:');
        const productsColumns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products'
    `);

        const productColNames = productsColumns.map((r: any) => r.column_name);
        console.log('Found columns:', productColNames.sort());

        const expectedProductCols = ['is_active', 'images_approved', 'images_pending_moderation', 'vendor_id', 'category_id'];
        const missingProductCols = expectedProductCols.filter(c => !productColNames.includes(c));

        if (missingProductCols.length > 0) {
            console.error('❌ MISSING columns in products:', missingProductCols);
        } else {
            console.log('✅ specific expected columns present in products table');
        }

        // Check product_image_moderation table
        console.log('\nChecking product_image_moderation table:');
        const modTable = await db.execute(sql`
      SELECT to_regclass('product_image_moderation') as exists
    `);

        if (!modTable[0].exists) {
            console.error('❌ Table product_image_moderation DOES NOT EXIST');
        } else {
            console.log('✅ Table product_image_moderation exists');

            const modColumns = await db.execute(sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'product_image_moderation'
      `);
            console.log('Found columns:', modColumns.map((r: any) => r.column_name).sort());
        }

    } catch (error) {
        console.error('Error querying database:', error);
    } finally {
        process.exit(0);
    }
}

main();
