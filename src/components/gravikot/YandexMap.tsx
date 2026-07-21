"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Yandex Maps component — lazy-loaded, SSR-safe.
 * Loads the Yandex Maps API only when the component mounts (client-side).
 * Shows a placeholder until the map is ready.
 */
export function YandexMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
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
        // Geocode the exact address for accurate placement
        ymaps.geocode("Самара, Советской Армии 23").then((res: any) => {
          const firstGeoObject = res.geoObjects.get(0);
          const coords = firstGeoObject
            ? firstGeoObject.geometry.getCoordinates()
            : [53.1838, 50.2293]; // fallback: approximate coords for ул. Советской Армии 23

          const map = new ymaps.Map(mapRef.current, {
            center: coords,
            zoom: 16,
            controls: ["zoomControl", "fullscreenControl"],
          });

          const placemark = new ymaps.Placemark(
            coords,
            {
              balloonContentHeader: "ГРАВИКОТ",
              balloonContentBody: "г. Самара, ул. Советской Армии, 23<br/>Самовывоз — время встречи согласовываем",
              hintContent: "ГРАВИКОТ — ул. Советской Армии, 23",
            },
            {
              preset: "islands#violetDotIconWithCaption",
              iconCaption: "ГРАВИКОТ",
            }
          );

          map.geoObjects.add(placemark);
          mapInstanceRef.current = map;
          setLoaded(true);
        }).catch(() => {
          // Fallback: init map with approximate coords if geocoder fails
          const coords = [53.1838, 50.2293];
          const map = new ymaps.Map(mapRef.current, {
            center: coords,
            zoom: 16,
            controls: ["zoomControl", "fullscreenControl"],
          });

          const placemark = new ymaps.Placemark(
            coords,
            {
              balloonContentHeader: "ГРАВИКОТ",
              balloonContentBody: "г. Самара, ул. Советской Армии, 23<br/>Самовывоз — время встречи согласовываем",
              hintContent: "ГРАВИКОТ — ул. Советской Армии, 23",
            },
            {
              preset: "islands#violetDotIconWithCaption",
              iconCaption: "ГРАВИКОТ",
            }
          );

          map.geoObjects.add(placemark);
          mapInstanceRef.current = map;
          setLoaded(true);
        });
      });
    }

    return () => {
      // Destroy map instance to prevent memory leaks
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.destroy(); } catch {}
        mapInstanceRef.current = null;
      }
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
