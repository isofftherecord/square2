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

function createPin() {
  const pin = document.createElement("div");
  pin.className = "s2-map-pin flex flex-col items-center";
  pin.innerHTML = `
    <div class="bg-s2-white px-4 py-3">
      <img src="/logo.png" alt="Square2" width="112" height="22" />
    </div>
    <div class="h-4 w-px bg-s2-orange"></div>
    <div class="size-2 bg-s2-orange"></div>
  `;
  return pin;
}

export function OfficeMap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !API_KEY || !MAP_ID) return;

    let cancelled = false;
    let clearMarker: (() => void) | undefined;

    ensureMapsOptions();

    (async () => {
      const { Map } = await importLibrary("maps");
      const { AdvancedMarkerElement } = await importLibrary("marker");
      if (cancelled || !ref.current) return;

      // Vector + tilt: edificios 3D en bloque (el raster es plano).
      const camera = { center: OFFICE, zoom: 18, heading: 35, tilt: 67.5 };
      const map = new Map(ref.current, {
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

      const marker = new AdvancedMarkerElement({
        map,
        position: OFFICE,
        content: createPin(),
        title: "Square2 — 3250 Mary Street, Suite 207",
      });
      clearMarker = () => {
        marker.map = null;
      };
    })().catch(() => {
      // Sin mapa interactivo si la API falla; queda el contenedor y la dirección.
    });

    return () => {
      cancelled = true;
      clearMarker?.();
    };
  }, []);

  return (
    // Hero a sangre, mismo breakout que TitleHero / MainHero.
    <section className="col-span-12 ml-[calc(50%-50vw)] w-screen max-w-[100vw]">
      <div ref={ref} className="s2-office-map h-[800px] w-full bg-s2-white" />


    </section>
  );
}
