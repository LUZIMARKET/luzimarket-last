"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface StoreMapLeafletClientProps {
    street?: string | null;
    city?: string | null;
    country?: string | null;
    className?: string;
    onAddressSelect?: (address: any) => void;
}

// Component to update map view when props change
function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

// Component to handle marker drag events
function DraggableMarker({ position, onDragEnd }: { position: [number, number], onDragEnd: (lat: number, lng: number) => void }) {
    const markerRef = useRef<L.Marker>(null);
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const { lat, lng } = marker.getLatLng();
                    onDragEnd(lat, lng);
                }
            },
        }),
        [onDragEnd],
    );

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
            icon={customIcon}
        >
            <Popup>Arrastra para ajustar la ubicación</Popup>
        </Marker>
    );
}

export default function StoreMapLeafletClient({ street, city, country, className }: StoreMapLeafletClientProps) {
    // Default to Mexico City
    const [position, setPosition] = useState<[number, number]>([19.4326, -99.1332]);
    const [loading, setLoading] = useState(false);

    // Initial geocoding (mock or real)
    useEffect(() => {
        // Simple client-side geocoding using Nominatim (OpenStreetMap)
        // Rate limited, so use sparingly.
        if (city || street) {
            const query = `${street || ''}, ${city || ''}, ${country || 'Mexico'}`;
            setLoading(true);
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const { lat, lon } = data[0];
                        setPosition([parseFloat(lat), parseFloat(lon)]);
                    }
                })
                .catch(err => console.error("Geocoding failed", err))
                .finally(() => setLoading(false));
        }
    }, [street, city, country]);

    const handleDragEnd = async (lat: number, lng: number) => {
        setPosition([lat, lng]);
        // Reverse geocoding could go here to auto-fill address
        // fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    };

    return (
        <div className={`rounded-xl overflow-hidden border border-gray-100 shadow-sm aspect-video relative z-0 ${className || ""}`}>
            <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableMarker position={position} onDragEnd={handleDragEnd} />
                <MapUpdater center={position} />
            </MapContainer>
        </div>
    );
}
