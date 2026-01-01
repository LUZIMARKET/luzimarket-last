"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { VendorLocationData } from "@/lib/actions/admin/vendor-map";
import { getCityCoordinates } from "@/lib/constants/mexico-cities";

// Fix Leaflet marker icon issue
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

type Props = {
    locations: VendorLocationData[];
};

export default function MapView({ locations }: Props) {
    const defaultCenter: [number, number] = [23.6345, -102.5528]; // Center of Mexico
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const markers = locations
        .map(loc => {
            const coords = getCityCoordinates(loc.city);
            if (!coords) return null;
            return { ...loc, ...coords };
        })
        .filter(Boolean) as (VendorLocationData & { lat: number; lng: number })[];

    return (
        <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-200 z-0">
            <MapContainer
                center={defaultCenter}
                zoom={5}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
            >
                {/* CartoDB Positron (Minimalist) Tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {markers.map((marker, idx) => (
                    <Marker
                        key={`${marker.city}-${idx}`}
                        position={[marker.lat, marker.lng]}
                        icon={customIcon}
                    >
                        <Popup>
                            <div className="text-center">
                                <h3 className="font-bold text-sm">{marker.city}, {marker.state}</h3>
                                <p className="text-xs text-gray-600">{marker.count} vendor{marker.count !== 1 ? 's' : ''}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
