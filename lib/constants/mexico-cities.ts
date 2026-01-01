export const MEXICO_CITIES_COORDINATES: Record<string, { lat: number; lng: number }> = {
    // Major Cities
    "Ciudad de México": { lat: 19.4326, lng: -99.1332 },
    "CDMX": { lat: 19.4326, lng: -99.1332 },
    "Guadalajara": { lat: 20.6597, lng: -103.3496 },
    "Monterrey": { lat: 25.6866, lng: -100.3161 },
    "Puebla": { lat: 19.0414, lng: -98.2063 },
    "Toluca": { lat: 19.2826, lng: -99.6557 },
    "Tijuana": { lat: 32.5149, lng: -117.0382 },
    "León": { lat: 21.1224, lng: -101.6859 },
    "Juárez": { lat: 31.6904, lng: -106.4245 },
    "Torreón": { lat: 25.5445, lng: -103.4320 },
    "San Luis Potosí": { lat: 22.1565, lng: -100.9855 },
    "Mérida": { lat: 20.9674, lng: -89.5926 },
    "Querétaro": { lat: 20.5888, lng: -100.3899 },
    "Aguascalientes": { lat: 21.8853, lng: -102.2916 },
    "Hermosillo": { lat: 29.0730, lng: -110.9559 },
    "Mexicali": { lat: 32.6245, lng: -115.4523 },
    "Culiacán": { lat: 24.8059, lng: -107.3948 },
    "Acapulco": { lat: 16.8531, lng: -99.8237 },
    "Cancún": { lat: 21.1619, lng: -86.8515 },
    "Chihuahua": { lat: 28.6330, lng: -106.0691 },
    "Saltillo": { lat: 25.4333, lng: -101.0750 },
    "Morelia": { lat: 19.7008, lng: -101.1844 },
    "Veracruz": { lat: 19.1738, lng: -96.1272 },
    "Villahermosa": { lat: 17.9895, lng: -92.9475 },
    "Reynosa": { lat: 26.0526, lng: -98.2970 },
    "Oaxaca": { lat: 17.0732, lng: -96.7266 },
    "Mazatlán": { lat: 23.2174, lng: -106.4111 },
    "Durango": { lat: 24.0277, lng: -104.6532 },
    "Xalapa": { lat: 19.5438, lng: -96.9102 },
    "Tampico": { lat: 22.2163, lng: -97.8920 },
    "Cuernavaca": { lat: 18.9186, lng: -99.2342 },
    "Pachuca": { lat: 20.1011, lng: -98.7591 },
    "Tuxtla Gutiérrez": { lat: 16.7569, lng: -93.1292 },
    "Matamoros": { lat: 25.8690, lng: -97.5027 },
    "Tepic": { lat: 21.5040, lng: -104.8946 },
    "Ensenada": { lat: 31.8667, lng: -116.5964 },
    "Nuevo Laredo": { lat: 27.4763, lng: -99.5164 },
    "Puerto Vallarta": { lat: 20.6534, lng: -105.2253 },
    "Los Cabos": { lat: 22.8905, lng: -109.9167 },
    "Campeche": { lat: 19.8301, lng: -90.5349 },
    "La Paz": { lat: 24.1426, lng: -110.3128 },
    "Zacatecas": { lat: 22.7709, lng: -102.5832 },
    "Colima": { lat: 19.2452, lng: -103.7241 },
    "Guanajuato": { lat: 21.0190, lng: -101.2574 },
    "Tlaxcala": { lat: 19.3139, lng: -98.2404 }
};

export const normalizeCityName = (city: string): string => {
    if (!city) return "";

    // Basic normalization
    let normalized = city.trim();

    // Mapping common variations to our keys
    if (normalized.match(/ciudad de m[eé]xico|cdmx|d\.f\./i)) return "Ciudad de México";

    // Capitalize first letter of each word
    return normalized.replace(/\b\w/g, c => c.toUpperCase());
};

export const getCityCoordinates = (city: string): { lat: number; lng: number } | null => {
    const normalized = normalizeCityName(city);
    return MEXICO_CITIES_COORDINATES[normalized] || MEXICO_CITIES_COORDINATES[city] || null;
};
