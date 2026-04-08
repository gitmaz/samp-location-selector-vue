<template>
  <div class="map-wrap">
    <LMap
      :zoom="initialZoom"
      :center="[initialLat, initialLng]"
      :use-global-leaflet="false"
      @click="onMapClick"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        :max-zoom="19"
      />

      <LMarker
        v-for="row in savedLocations"
        :key="row.id"
        :lat-lng="[row.latitude, row.longitude]"
        :icon="savedIcon"
      >
        <LPopup>
          {{ row.address }}
        </LPopup>
      </LMarker>

      <LMarker v-if="pendingLatLng" :lat-lng="pendingLatLng" :icon="pendingIcon" />
    </LMap>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { LMap, LMarker, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';

const props = defineProps({
  initialLat: { type: Number, required: true },
  initialLng: { type: Number, required: true },
  initialZoom: { type: Number, default: 14 },
  savedLocations: { type: Array, default: () => [] },
});

const emit = defineEmits(['update:coords']);

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

const pendingLatLng = ref(null);

const savedLocations = computed(() =>
  (props.savedLocations || []).filter(
    (row) =>
      row &&
      typeof row.id !== 'undefined' &&
      typeof row.latitude === 'number' &&
      typeof row.longitude === 'number'
  )
);

function onMapClick(e) {
  const { lat, lng } = e.latlng;
  pendingLatLng.value = [lat, lng];
  emit('update:coords', { lat, lng });
}
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

.map-wrap :deep(.leaflet-container) {
  height: 100%;
  width: 100%;
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
