/**
 * Carrier tracking URL patterns
 */
export const CARRIER_TRACKING_URLS: Record<string, string> = {
    fedex: "https://www.fedex.com/fedextrack/?trknbr={trackingNumber}",
    ups: "https://www.ups.com/track?loc=en_US&tracknum={trackingNumber}",
    dhl: "https://www.dhl.com/en/express/tracking.html?AWB={trackingNumber}",
    estafeta: "https://www.estafeta.com/Herramientas/Rastreo?wayBillType=0&wayBill={trackingNumber}",
    "correos-de-mexico": "https://www.correosdemexico.gob.mx/SSLServicios/RastreoEnvios/Rastreo.aspx?codigo={trackingNumber}",
    "99minutos": "https://99minutos.com/rastreo/{trackingNumber}",
    "uber": "https://www.uber.com/mx/es/",
    "rappi": "https://www.rappi.com.mx/",
    "vendor-shipping": "https://wa.me/?text=Hola,%20quisiera%20saber%20el%20estatus%20de%20mi%20pedido%20{trackingNumber}",
};

/**
 * Validates tracking number format
 */
export function validateTrackingNumber(trackingNumber: string, carrier?: string): boolean {
    // Remove whitespace
    const cleaned = trackingNumber.trim().replace(/\s+/g, "");

    if (cleaned.length < 5) return false;

    // Basic validation - can be enhanced per carrier
    const patterns: Record<string, RegExp> = {
        fedex: /^[0-9]{12,22}$/,
        ups: /^1Z[A-Z0-9]{16}$/i,
        dhl: /^[0-9]{10,11}$/,
        estafeta: /^[0-9]{10,22}$/,
    };

    if (carrier && patterns[carrier.toLowerCase()]) {
        return patterns[carrier.toLowerCase()].test(cleaned);
    }

    // Generic validation if carrier not specified or not in patterns
    return /^[A-Z0-9]{5,30}$/i.test(cleaned);
}

/**
 * Generates tracking URL for a carrier
 */
export function generateTrackingUrl(trackingNumber: string, carrier: string): string {
    if (!carrier) return `https://www.google.com/search?q=${encodeURIComponent("tracking " + trackingNumber)}`;

    const pattern = CARRIER_TRACKING_URLS[carrier.toLowerCase()];

    if (!pattern) {
        // Default fallback
        return `https://www.google.com/search?q=${encodeURIComponent(carrier + " tracking " + trackingNumber)}`;
    }

    return pattern.replace("{trackingNumber}", trackingNumber);
}
