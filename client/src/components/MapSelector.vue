<template>
  <div ref="wrap" class="map-wrap"></div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, onUpdated, ref } from 'vue';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Leaflet + bundlers: fix default marker asset URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

const props = defineProps({
  initialLat: { type: Number, required: true },
  initialLng: { type: Number, required: true },
  initialZoom: { type: Number, default: 14 },
  savedLocations: { type: Array, default: () => [] },
});

const emit = defineEmits(['update:coords']);

const wrap = ref(null);
let map;
let pendingMarker;
let savedLayer;

const savedIcon = L.divIcon({
  className: 'marker marker--saved',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const pendingIcon = L.divIcon({
  className: 'marker marker--pending',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function placePendingMarker(latlng) {
  if (!map) return;
  if (pendingMarker) pendingMarker.setLatLng(latlng);
  else {
    pendingMarker = L.marker(latlng, { icon: pendingIcon }).addTo(map);
  }
  emit('update:coords', { lat: latlng.lat, lng: latlng.lng });
}

function renderSavedMarkers() {
  if (!map) return;
  if (savedLayer) {
    savedLayer.clearLayers();
  } else {
    savedLayer = L.layerGroup().addTo(map);
  }

  for (const row of props.savedLocations || []) {
    if (!row || typeof row.latitude !== 'number' || typeof row.longitude !== 'number') continue;
    L.marker([row.latitude, row.longitude], { icon: savedIcon })
      .bindPopup(row.address || `${row.latitude}, ${row.longitude}`)
      .addTo(savedLayer);
  }
}

onMounted(() => {
  map = L.map(wrap.value, {
    zoomControl: true,
  }).setView([props.initialLat, props.initialLng], props.initialZoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  map.on('click', (e) => {
    placePendingMarker(e.latlng);
  });

  renderSavedMarkers();
});

onUpdated(() => {
  // Re-render saved markers whenever parent updates `savedLocations`.
  renderSavedMarkers();
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
    pendingMarker = null;
    savedLayer = null;
  }
});
</script>

<style scoped>
.map-wrap {
  height: min(60vh, 520px);
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #cbd5e1;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}
</style>

<style>
/* Leaflet markers via divIcon */
.marker {
  border-radius: 999px;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.25);
}
.marker--saved {
  background: #2563eb; /* blue */
}
.marker--pending {
  background: #ef4444; /* red */
}
</style>
