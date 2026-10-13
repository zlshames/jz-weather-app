/**
 * The radar map runs in a WebView with MapLibre GL (https://maplibre.org), loaded
 * from unpkg with integrity hashes. RadarScreen drives it through `window.radar`
 * and the page reports back with `ReactNativeWebView.postMessage`:
 * - { type: "ready" } once the map has loaded (again after any reload)
 * - { type: "error" } if the map couldn't start
 *
 * Base map: OpenFreeMap's "positron" style over OpenStreetMap data, which is free
 * with no API key (https://openfreemap.org). Radar frames are inserted below the
 * map's labels so place names stay readable.
 * Radar: RainViewer tiles, which only exist up to tile zoom 7 on the free tier;
 * MapLibre stretches those tiles when the map is zoomed in further.
 */
// ? MapLibre zoom levels use 512px tiles, so they run one level below
// ? 256px-tile zooms like RainViewer's
export const LOCATION_ZOOM = 6;
export const OVERVIEW_ZOOM = 3;
const RADAR_MAX_TILE_ZOOM = 7;
const RADAR_OPACITY = 0.8;
/** How far RadarScreen's control panel overlaps the bottom of the map */
export const PANEL_OVERLAP = 24;

const MAPLIBRE_VERSION = "4.7.1";
const MAPLIBRE_JS_INTEGRITY =
  "sha384-SYKAG6cglRMN0RVvhNeBY0r3FYKNOJtznwA0v7B5Vp9tr31xAHsZC0DqkQ/pZDmj";
const MAPLIBRE_CSS_INTEGRITY =
  "sha384-MinO0mNliZ3vwppuPOUnGa+iq619pfMhLVUXfC4LHwSCvF9H+6P/KO4Q7qBOYV5V";
const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

export const radarMapHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.css"
    integrity="${MAPLIBRE_CSS_INTEGRITY}" crossorigin="anonymous" />
  <script src="https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.js"
    integrity="${MAPLIBRE_JS_INTEGRITY}" crossorigin="anonymous"></script>
  <style>
    html, body, #map { margin: 0; width: 100%; height: 100%; background: #e9ecef; }
    .maplibregl-ctrl-attrib { font-size: 9px; }
    /* RadarScreen's control panel overlaps the bottom of the map */
    .maplibregl-ctrl-bottom-right, .maplibregl-ctrl-bottom-left { bottom: ${PANEL_OVERLAP}px; }
    .location-dot {
      width: 16px; height: 16px; border-radius: 50%;
      background: #1a73e8; border: 3px solid #ffffff;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    (function () {
      function post(message) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(message));
        }
      }
      if (!window.maplibregl) {
        post({ type: "error" });
        return;
      }

      var map;
      try {
        map = new maplibregl.Map({
          container: "map",
          style: "${MAP_STYLE_URL}",
          center: [-98.35, 39.5],
          zoom: ${OVERVIEW_ZOOM},
          minZoom: 1,
          maxZoom: 10,
          attributionControl: false,
          dragRotate: false,
          pitchWithRotate: false,
          touchPitch: false,
        });
      } catch (e) {
        // MapLibre throws when WebGL isn't available
        post({ type: "error" });
        return;
      }
      map.touchZoomRotate.disableRotation();
      map.addControl(
        new maplibregl.AttributionControl({
          compact: false,
          customAttribution: '<a href="https://www.rainviewer.com">RainViewer</a>',
        }),
        "bottom-right"
      );

      var loaded = false;
      var labelsLayerId;
      var frameIds = [];
      var shown = -1;
      var marker = null;

      map.on("error", function () {
        if (!loaded) post({ type: "error" });
      });

      map.on("load", function () {
        loaded = true;
        var labels = map.getStyle().layers.filter(function (layer) {
          return layer.type === "symbol";
        });
        labelsLayerId = labels.length ? labels[0].id : undefined;
        post({ type: "ready" });
      });

      window.radar = {
        // Every frame gets its own layer up front so playback doesn't wait on tiles
        setFrames: function (host, list) {
          frameIds.forEach(function (id) {
            map.removeLayer(id);
            map.removeSource(id);
          });
          frameIds = list.map(function (frame, index) {
            var id = "radar-" + frame.time + "-" + index;
            map.addSource(id, {
              type: "raster",
              tiles: [host + frame.path + "/256/{z}/{x}/{y}/2/1_1.png"],
              tileSize: 256,
              maxzoom: ${RADAR_MAX_TILE_ZOOM},
            });
            map.addLayer(
              {
                id: id,
                type: "raster",
                source: id,
                paint: {
                  "raster-opacity": 0,
                  "raster-opacity-transition": { duration: 0, delay: 0 },
                  "raster-fade-duration": 0,
                },
              },
              labelsLayerId
            );
            return id;
          });
          shown = -1;
        },
        showFrame: function (index) {
          if (frameIds[shown]) map.setPaintProperty(frameIds[shown], "raster-opacity", 0);
          shown = index;
          if (frameIds[shown]) map.setPaintProperty(frameIds[shown], "raster-opacity", ${RADAR_OPACITY});
        },
        center: function (latitude, longitude, zoom, showMarker) {
          map.jumpTo({ center: [longitude, latitude], zoom: zoom });
          if (marker) marker.remove();
          marker = null;
          if (showMarker) {
            var dot = document.createElement("div");
            dot.className = "location-dot";
            marker = new maplibregl.Marker({ element: dot })
              .setLngLat([longitude, latitude])
              .addTo(map);
          }
        },
      };
    })();
  </script>
</body>
</html>`;
