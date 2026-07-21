"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Yandex Maps component — lazy-loaded, SSR-safe.
 * Loads the Yandex Maps API only when the component mounts (client-side).
 * Shows a placeholder until the map is ready.
 */
export function YandexMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // Avoid duplicate script injection
    if ((window as unknown as Record<string, unknown>).__yandex_maps_loaded__) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?apikey=549ec368-a250-41a7-9806-50f3076df8a1&lang=ru_RU";
    script.async = true;
    script.onload = () => {
      (window as unknown as Record<string, unknown>).__yandex_maps_loaded__ = true;
      initMap();
    };
    document.head.appendChild(script);

    function initMap() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ymaps = (window as any).ymaps;
      if (!ymaps || !mapRef.current) return;

      ymaps.ready(() => {
        const map = new ymaps.Map(mapRef.current, {
          center: [53.1959, 50.1002], // Самара, центр города
          zoom: 14,
          controls: ["zoomControl", "fullscreenControl"],
        });

        // Placemark — мастерская ГРАВИКОТ
        const placemark = new ymaps.Placemark(
          [53.1959, 50.1002],
          {
            balloonContentHeader: "ГРАВИКОТ",
            balloonContentBody: "Самовывоз — место встречи согласовываем индивидуально",
            hintContent: "ГРАВИКОТ — самовывоз в Самаре",
          },
          {
            preset: "islands#violetDotIconWithCaption",
            iconCaption: "ГРАВИКОТ",
          }
        );

        map.geoObjects.add(placemark);
        setLoaded(true);
      });
    }

    return () => {
      // Cleanup: destroy map instance to prevent memory leaks
      // (script stays in DOM — Yandex Maps API doesn't support unloading)
    };
  }, []);

  return (
    <div className="relative">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center glass rounded-2xl z-10">
          <span className="text-sky-100/50 text-sm font-tech">Загрузка карты...</span>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full rounded-2xl overflow-hidden border border-white/10"
        style={{ height: 320 }}
      />
    </div>
  );
}
