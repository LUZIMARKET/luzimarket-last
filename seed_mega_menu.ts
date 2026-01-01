
import { db } from "./db";
import { products, categories, vendors } from "./db/schema";
import { eq } from "drizzle-orm";
// slugify library might not be available, I will implement simple util
import { faker } from '@faker-js/faker';

// Structure from Header.tsx
const megaMenuStructure = [
    {
        group: "Giftshop",
        items: ["Baby + Kids", "Joyería", "Home", "Experiencias", "Play + Fitness", "Tech", "Pets", "Kits"],
        slugFn: (item: string) => item.toLowerCase().replace(/\s+/g, '-')
    },
    {
        group: "Sweet",
        items: ["Pasteles", "Postres", "Galletas", "Chocolates"],
        slugFn: (item: string) => item.toLowerCase()
    },
    {
        group: "Snacks",
        items: ["Botanas", "Fit / Healthy", "Bebidas"],
        slugFn: (item: string) => item.toLowerCase().replace(' / ', '-').replace('/', '-')
    },
    {
        group: "Flowershop",
        items: ["Classic", "Modern", "Plantas", "Condolencias", "Romance"],
        slugFn: (item: string) => item.toLowerCase()
    },
    {
        group: "Wellness",
        items: ["Beauty", "Self-care", "Hair", "SPA"],
        slugFn: (item: string) => item.toLowerCase().replace('-', '') // Header: .replace('-', '') 
    }
];

// Product Data Templates for better realism
const productTemplates: Record<string, { names: string[], images: string[] }> = {
    "Baby + Kids": {
        names: ["Juguete Educativo Madera", "Ropa Bebé Algodón", "Set Regalo Baby Shower", "Peluche Suave Oso", "Manta Tejida a Mano"],
        images: ["https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4", "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1"]
    },
    "Joyería": {
        names: ["Collar de Plata Minimalista", "Aretes de Oro 14k", "Anillo de Compromiso", "Pulsera de Hilo Rojo", "Set de Joyería Fina"],
        images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338", "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908"]
    },
    "Home": {
        names: ["Vela Aromática Soja", "Cojín Decorativo Lino", "Maceta Cerámica Moderna", "Set de Tazas Café", "Lámpara de Mesa"],
        images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7", "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e"]
    },
    "Experiencias": {
        names: ["Clase de Cocina Italiana", "Cata de Vinos Privada", "Sesión de Spa Parejas", "Tour de Fotografía", "Taller de Cerámica"],
        images: ["https://images.unsplash.com/photo-1556910103-1c02745a30bf", "https://images.unsplash.com/photo-1528605248644-14dd04022da1"]
    },
    "Play + Fitness": {
        names: ["Tapete de Yoga Eco", "Set de Pesas 5kg", "Cuerda de Saltar Pro", "Botella de Agua Térmica", "Bandas de Resistencia"],
        images: ["https://images.unsplash.com/photo-1576678927484-cc907957088c", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"]
    },
    "Tech": {
        names: ["Audífonos Bluetooth", "Cargador Inalámbrico Rápido", "Funda Laptop Piel", "Stand para Celular", "Smartwatch Deportivo"],
        images: ["https://images.unsplash.com/photo-1550009158-9ebf69173e03", "https://images.unsplash.com/photo-1519389950473-47ba0277781c"]
    },
    "Pets": {
        names: ["Cama para Perro Suave", "Juguete Gato Plumas", "Collar de Cuero Personalizado", "Plato Cerámica Mascota", "Premios Naturales Perro"],
        images: ["https://images.unsplash.com/photo-1541599540903-216a46ca1dc0", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"]
    },
    "Kits": {
        names: ["Kit Spa en Casa", "Kit Gin & Tonic", "Kit Siembra Tu Huerto", "Kit Café Gourmet", "Kit Afeitado Clásico"],
        images: ["https://images.unsplash.com/photo-1603195863547-8203010b9862", "https://images.unsplash.com/photo-1556911220-e15b29be8c8f"]
    },
    "Pasteles": {
        names: ["Pastel de Zanahoria", "Red Velvet Cake", "Pastel de Chocolate Trufa", "Cheesecake de Frutos Rojos", "Pastel de Tres Leches"],
        images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587", "https://images.unsplash.com/photo-1565958011703-44f9829ba187"]
    },
    "Postres": {
        names: ["Brownies de Nuez", "Macarons Surtidos", "Tartaleta de Limón", "Mousse de Mango", "Eclair de Chocolate"],
        images: ["https://images.unsplash.com/photo-1563729784474-d77dbb933a9e", "https://images.unsplash.com/photo-1551024601-bec78aea704b"]
    },
    "Galletas": {
        names: ["Galletas Chispas Chocolate", "Galletas de Avena", "Galletas Decoradas", "Shortbread Escocés", "Biscotti de Almendra"],
        images: ["https://images.unsplash.com/photo-1499636138143-bd649043ea52", "https://images.unsplash.com/photo-1558961363-fa8fdf82db35"]
    },
    "Chocolates": {
        names: ["Caja de Trufas Surtidas", "Barra Chocolate Oscuro", "Bombones Rellenos", "Chocolate con Leche Suizo", "Enjambre de Chocolate"],
        images: ["https://images.unsplash.com/photo-1511381971708-d5d6615b63aa", "https://images.unsplash.com/photo-1481391319762-47dff72954d9"]
    },
    "Botanas": {
        names: ["Papas Artesanales", "Nueces Mixtas", "Pretzels Chocolate", "Caja de Quesos y Carnes", "Frutos Secos Enchilados"],
        images: ["https://images.unsplash.com/photo-1621506289937-a8e4df240d0b", "https://images.unsplash.com/photo-1599490659213-e2b9527bd087"]
    },
    "Fit / Healthy": {
        names: ["Barra Proteína Vegana", "Granola Sin Azúcar", "Chips de Kale", "Jugo Verde Detox", "Tortitas de Arroz"],
        images: ["https://images.unsplash.com/photo-1599490659213-e2b9527bd087", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd"]
    },
    "Bebidas": {
        names: ["Kombucha Artesanal", "Cold Brew Coffee", "Té Matcha Ceremonial", "Agua Mineral Gasificada", "Jugo Prensa Fría"],
        images: ["https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd", "https://images.unsplash.com/photo-1497935586351-b67a49e012bf"]
    },
    "Classic": {
        names: ["Ramo de Rosas Rojas", "Orquídea Blanca", "Tulipanes Holandeses", "Girasoles Vibrantes", "Lirios Elegantes"],
        images: ["https://images.unsplash.com/photo-1561181286-d3fee7d55364", "https://images.unsplash.com/photo-1582794543139-8ac92a9539d9"]
    },
    "Modern": {
        names: ["Arreglo Floral Exótico", "Diseño Floral Minimalista", "Flores Secas Boho", "Centro de Mesa Moderno", "Ramo Silvestre"],
        images: ["https://images.unsplash.com/photo-1562690868-60bbe7293e94", "https://images.unsplash.com/photo-1592233649685-64906f2334b0"]
    },
    "Plantas": {
        names: ["Monstera Deliciosa", "Lengua de Suegra (Sansevieria)", "Ficus Lyrata", "Suculentas Variadas", "Pothos Colgante"],
        images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411", "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9"]
    },
    "Condolencias": {
        names: ["Corona Fúnebre Blanca", "Arreglo de Lirios Blancos", "Canasta de Paz", "Orquídea Simpatía", "Cruz de Rosas"],
        images: ["https://images.unsplash.com/photo-1595166668735-64585c490a19", "https://images.unsplash.com/photo-1519757095907-73b3060f6063"]
    },
    "Romance": {
        names: ["100 Rosas Rojas", "Caja Corazón con Flores", "Ramo Pasión y Amor", "Pétalos de Rosa", "Set Flores y Chocolates"],
        images: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23", "https://images.unsplash.com/photo-1518199266791-5375a83190b7"]
    },
    "Beauty": {
        names: ["Labial Mate Rojo", "Paleta de Sombras Nude", "Suero Facial Vitamina C", "Base Maquillaje Ligera", "Mascara Pestañas Volumen"],
        images: ["https://images.unsplash.com/photo-1522335789203-abd6523f4364", "https://images.unsplash.com/photo-1512496015851-a90fb38ba796"]
    },
    "Self-care": {
        names: ["Mascarilla Facial Hidratante", "Sales de Baño Relajantes", "Rodillo de Jade", "Antifaz de Seda", "Diario de Gratitud"],
        images: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881", "https://images.unsplash.com/photo-1544161515-4ab6ce6db874"]
    },
    "Hair": {
        names: ["Shampoo Sólido Natural", "Aceite de Argán Cabello", "Cepillo de Bambú", "Tratamiento Capilar Intensivo", "Pasadores Decorativos"],
        images: ["https://images.unsplash.com/photo-1585232975374-3079d3096d24", "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388"]
    },
    "SPA": {
        names: ["Difusor de Aromas", "Aceites Esenciales Set", "Bata de Baño Lujo", "Pantuflas Suaves", "Toalla Microfibra"],
        images: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef", "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2"]
    }
};

async function seed() {
    console.log("🌱 Starting Mega Menu Seeding...");

    // 1. Get a Vendor
    const vendor = await db.query.vendors.findFirst();
    if (!vendor) {
        console.error("❌ No vendor found! Please seed vendors first.");
        process.exit(1);
    }
    const vendorId = vendor.id;
    console.log(`Using vendor: ${vendor.businessName}`);

    // 2. Iterate and Create
    for (const group of megaMenuStructure) {
        console.log(`Processing Group: ${group.group}`);

        for (const itemName of group.items) {
            const slug = group.slugFn(itemName);
            console.log(`  > Checking: ${itemName} (slug: ${slug})`);

            // Check if category exists
            let category = await db.query.categories.findFirst({
                where: eq(categories.slug, slug)
            });

            if (!category) {
                console.log(`    - Creating Category: ${itemName}`);
                const inserted = await db.insert(categories).values({
                    name: itemName,
                    slug: slug,
                    isActive: true,
                    description: `Category for ${itemName}`,
                    imageUrl: productTemplates[itemName]?.images[0] || null
                }).returning();
                category = inserted[0];
            } else {
                console.log(`    - Category exists.`);
            }

            // Check products
            // We will blindly create 3 new products just to be sure there's content.
            // Or check count first.

            const templates = productTemplates[itemName] || { names: [`Product for ${itemName}`], images: ["https://placehold.co/400"] };

            console.log(`    - Creating ${templates.names.length} products...`);

            for (const prodName of templates.names) {
                // Simple random image from the list
                const img = templates.images[Math.floor(Math.random() * templates.images.length)];
                // Random price 100 - 2000
                const price = (Math.random() * 1900 + 100).toFixed(2);

                await db.insert(products).values({
                    vendorId: vendorId,
                    categoryId: category.id,
                    name: prodName,
                    slug: `${slug}-${prodName.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 1000)}`, // Unique slug
                    description: `This is a premium ${prodName} from our ${itemName} collection.`,
                    price: price,
                    images: [img],
                    isActive: true,
                    stock: 50,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
        }
    }

    console.log("✅ Seeding Complete!");
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
