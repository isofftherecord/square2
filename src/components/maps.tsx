"use client";

import { useEffect, useRef } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

// 3250 Mary Street, Suite 207 · Miami, FL 33133
const OFFICE = { lat: 25.7284, lng: -80.2417 };
const API_KEY = configured(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
const MAP_ID = configured(process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID);

function configured(value?: string) {
  return value && value !== "..." ? value : undefined;
}

let mapsOptionsReady = false;

function ensureMapsOptions() {
  if (mapsOptionsReady || !API_KEY) return;
  setOptions({
    key: API_KEY,
    v: "weekly",
    mapIds: MAP_ID ? [MAP_ID] : undefined,
  });
  mapsOptionsReady = true;
}

export function OfficeMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mapRef.current;
    const pin = pinRef.current;
    if (!el || !pin || !API_KEY || !MAP_ID) return;

    let cancelled = false;
    let overlay: { setMap: (map: unknown) => void } | undefined;

    ensureMapsOptions();

    (async () => {
      const { Map, OverlayView } = await importLibrary("maps");
      if (cancelled || !mapRef.current) return;

      // Vector + tilt: edificios 3D en bloque (el raster es plano).
      const camera = { center: OFFICE, zoom: 18, heading: 35, tilt: 67.5 };
      const map = new Map(mapRef.current, {
        ...camera,
        mapId: MAP_ID,
        renderingType: "VECTOR",
        tiltInteractionEnabled: true,
        headingInteractionEnabled: true,
        disableDefaultUI: true,
        gestureHandling: "cooperative",
        keyboardShortcuts: false,
        clickableIcons: false,
        backgroundColor: "#ffffff",
        colorScheme: "LIGHT",
      });

      // El tilt a veces se ignora hasta que el vector termina de cargar.
      let cameraReady = false;
      const applyCamera = () => {
        if (cancelled || cameraReady) return;
        map.moveCamera(camera);
        if ((map.getTilt() ?? 0) >= 60) cameraReady = true;
      };
      map.addListener("tilesloaded", applyCamera);
      map.addListener("renderingtype_changed", applyCamera);

      // El pin vive fuera de .gm-style para que el filtro gris no lo pinte.
      const pinOverlay = new OverlayView();
      pinOverlay.onAdd = () => {};
      pinOverlay.onRemove = () => {};
      pinOverlay.draw = () => {
        const projection = pinOverlay.getProjection();
        if (!projection) return;
        const point = projection.fromLatLngToContainerPixel(OFFICE);
        if (!point) return;
        pin.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`;
        pin.style.visibility = "visible";
      };
      pinOverlay.setMap(map);
      overlay = pinOverlay;
    })().catch(() => {
      // Sin mapa interactivo si la API falla; queda el contenedor y la dirección.
    });

    return () => {
      cancelled = true;
      overlay?.setMap(null);
    };
  }, []);

  return (
    // Mismo marco 1440 que TitleHero / MainHero.
    <section className="s2-hero">
      <div className="relative h-[420px] w-full bg-s2-white lg:h-[800px]">
        <div ref={mapRef} className="s2-office-map absolute inset-0" />
        <div
          ref={pinRef}
          className="s2-map-pin pointer-events-none absolute top-0 left-0 z-10 invisible"
        >
          <img
            className="block size-14"
            src="/icons/s2-mark-orange.png"
            alt="Square2"
            width={56}
            height={56}
          />
        </div>
      </div>
    </section>
  );
}
