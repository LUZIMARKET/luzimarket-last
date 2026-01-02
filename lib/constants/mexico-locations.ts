export interface MexicoLocation {
    city: string;
    state: string;
    country: string;
    displayName: string;
}

export const MEXICO_LOCATIONS: MexicoLocation[] = [
    // User Requested
    { city: 'Torreón', state: 'Coahuila', country: 'MX', displayName: 'TORREÓN, COAH' },

    // Original List
    { city: 'Monterrey', state: 'Nuevo León', country: 'MX', displayName: 'MONTERREY, NL' },
    { city: 'CDMX', state: 'CDMX', country: 'MX', displayName: 'CDMX' },
    { city: 'Guadalajara', state: 'Jalisco', country: 'MX', displayName: 'GUADALAJARA, JAL' },
    { city: 'Querétaro', state: 'Querétaro', country: 'MX', displayName: 'QUERETARO, QRO' },
    { city: 'Puebla', state: 'Puebla', country: 'MX', displayName: 'PUEBLA, PUE' },
    { city: 'Cancún', state: 'Quintana Roo', country: 'MX', displayName: 'CANCUN, QROO' },
    { city: 'Mérida', state: 'Yucatán', country: 'MX', displayName: 'MERIDA, YUC' },
    { city: 'Tijuana', state: 'Baja California', country: 'MX', displayName: 'TIJUANA, BC' },
    { city: 'Toluca', state: 'Estado de México', country: 'MX', displayName: 'TOLUCA, EDOMEX' },

    // Expanded Major Cities
    { city: 'León', state: 'Guanajuato', country: 'MX', displayName: 'LEÓN, GTO' },
    { city: 'San Luis Potosí', state: 'San Luis Potosí', country: 'MX', displayName: 'SAN LUIS POTOSÍ, SLP' },
    { city: 'Chihuahua', state: 'Chihuahua', country: 'MX', displayName: 'CHIHUAHUA, CHIH' },
    { city: 'Hermosillo', state: 'Sonora', country: 'MX', displayName: 'HERMOSILLO, SON' },
    { city: 'Saltillo', state: 'Coahuila', country: 'MX', displayName: 'SALTILLO, COAH' },
    { city: 'Aguascalientes', state: 'Aguascalientes', country: 'MX', displayName: 'AGUASCALIENTES, AGS' },
    { city: 'Veracruz', state: 'Veracruz', country: 'MX', displayName: 'VERACRUZ, VER' },
    { city: 'Villahermosa', state: 'Tabasco', country: 'MX', displayName: 'VILLAHERMOSA, TAB' },
    { city: 'Cuernavaca', state: 'Morelos', country: 'MX', displayName: 'CUERNAVACA, MOR' },
    { city: 'Morelia', state: 'Michoacán', country: 'MX', displayName: 'MORELIA, MICH' },
    { city: 'Culiacán', state: 'Sinaloa', country: 'MX', displayName: 'CULIACÁN, SIN' },
    { city: 'Mazatlán', state: 'Sinaloa', country: 'MX', displayName: 'MAZATLÁN, SIN' },
    { city: 'Acapulco', state: 'Guerrero', country: 'MX', displayName: 'ACAPULCO, GRO' },
    { city: 'Zapopan', state: 'Jalisco', country: 'MX', displayName: 'ZAPOPAN, JAL' },
    { city: 'Ciudad Juárez', state: 'Chihuahua', country: 'MX', displayName: 'CD. JUÁREZ, CHIH' },
    { city: 'Mexicali', state: 'Baja California', country: 'MX', displayName: 'MEXICALI, BC' },
];

// Helper to get all unique states
export const MEXICO_STATES = Array.from(new Set(MEXICO_LOCATIONS.map(c => c.state))).sort();

// Helper to get cities by state
export const getCitiesByState = (state: string) => {
    return MEXICO_LOCATIONS.filter(l => l.state === state).map(l => l.city).sort();
};
