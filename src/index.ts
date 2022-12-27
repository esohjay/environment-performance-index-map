//request openstreetlayer
const layer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

//wms layer names
const environmentalPerformanceIndexLayers = {
  wasteManagement:
    "epi:epi-environmental-performance-index-2020_hlt-waste-management",
  sanitationAndDrinkingWater:
    "epi:epi-environmental-performance-index-2020_hlt-sanitation-and-drinking-water",
  airQuality: "epi:epi-environmental-performance-index-2020_hlt-air-quality",
  health: "epi:epi-environmental-performance-index-2020_hlt",
  waterResources:
    "epi:epi-environmental-performance-index-2020_eco-water-resources",
  pollutionEmission:
    "epi:epi-environmental-performance-index-2020_eco-pollution-emissions",
  fisheries: "epi:epi-environmental-performance-index-2020_eco-fisheries",
  climateChange:
    "epi:epi-environmental-performance-index-2020_eco-climate-change",
  biodiversityAndHabitat:
    "epi:epi-environmental-performance-index-2020_eco-biodiversity-and-habitat",
  agriculture: "epi:epi-environmental-performance-index-2020_eco-agriculture",
  ecosystemServices:
    "epi:epi-environmental-performance-index-2020_eco-ecosystem-services",
};
const agriculture = L.tileLayer.wms(
  "https://sedac.ciesin.columbia.edu/geoserver/wms",
  {
    layers: environmentalPerformanceIndexLayers.agriculture,
    format: "image/jpeg",
    transparent: false,
    opacity: 0.9,
    attribution:
      '<a href="https://sedac.ciesin.columbia.edu/maps/services">Sedac</a>',
  }
);

//instantiate map class
const map = new MapHandles(
  "map",
  "https://sedac.ciesin.columbia.edu/geoserver/wms",
  {
    zoom: 3,
    center: [51.505, -0.09],
    layers: [layer, agriculture],
  }
);

let baseMaps = {
  OpenstreetMap: layer,
};

let overlayMaps = {
  "<span class='control-span'>Agriculture</span>": agriculture,

  "<span class='control-span'>Air Quality</span>": map.addTileLayerWMS({
    layers: environmentalPerformanceIndexLayers.airQuality,
  }),
  "<span class='control-span'>Biodiversity and Habitat</span>":
    map.addTileLayerWMS({
      layers: environmentalPerformanceIndexLayers.biodiversityAndHabitat,
    }),
  "<span class='control-span'>Climate Change</span>": map.addTileLayerWMS({
    layers: environmentalPerformanceIndexLayers.climateChange,
  }),
  "<span class='control-span'>Ecosystem Services</span>": map.addTileLayerWMS({
    layers: environmentalPerformanceIndexLayers.ecosystemServices,
  }),
  "<span class='control-span'>Fisheries</span>": map.addTileLayerWMS({
    layers: environmentalPerformanceIndexLayers.fisheries,
  }),
  "<span class='control-span'>Health</span>": map.addTileLayerWMS({
    layers: environmentalPerformanceIndexLayers.health,
  }),
  "<span class='control-span'>Pollution Emission</span>": map.addTileLayerWMS({
    layers: environmentalPerformanceIndexLayers.pollutionEmission,
  }),
  "<span class='control-span'>Sanitation and Drinking Water</span>":
    map.addTileLayerWMS({
      layers: environmentalPerformanceIndexLayers.sanitationAndDrinkingWater,
    }),
  "<span class='control-span'>Waste Management</span>": map.addTileLayerWMS({
    layers: environmentalPerformanceIndexLayers.wasteManagement,
  }),
  "<span class='control-span'>Water Resources</span>": map.addTileLayerWMS({
    layers: environmentalPerformanceIndexLayers.waterResources,
  }),
};

//add control layer to map
let layerControl = L.control.layers(overlayMaps).addTo(map.mapView);
//get control div
let layerElement = layerControl.getContainer();
const inputs = document.getElementsByTagName("input");

const setLegendImageUrl = () => {
  let layerName;
  let url = "";

  for (let singleInput of inputs) {
    if (singleInput.checked) {
      layerName = singleInput.nextSibling?.textContent?.trim();

      break;
    }
  }

  switch (layerName) {
    case "Agriculture":
      url = map.makeUrl(environmentalPerformanceIndexLayers.agriculture);
      break;
    case "Ecosystem Services":
      url = map.makeUrl(environmentalPerformanceIndexLayers.ecosystemServices);
      break;
    case "Biodiversity and Habitat":
      url = map.makeUrl(
        environmentalPerformanceIndexLayers.biodiversityAndHabitat
      );
      break;
    case "Climate Change":
      url = map.makeUrl(environmentalPerformanceIndexLayers.climateChange);
      break;
    case "Fisheries":
      url = map.makeUrl(environmentalPerformanceIndexLayers.fisheries);
      break;
    case "Health":
      url = map.makeUrl(environmentalPerformanceIndexLayers.health);
      break;
    case "Pollution Emission":
      url = map.makeUrl(environmentalPerformanceIndexLayers.pollutionEmission);
      break;
    case "Sanitation and Drinking Water":
      url = map.makeUrl(
        environmentalPerformanceIndexLayers.sanitationAndDrinkingWater
      );
      break;
    case "Waste Management":
      url = map.makeUrl(environmentalPerformanceIndexLayers.wasteManagement);
      break;
    case "Water Resources":
      url = map.makeUrl(environmentalPerformanceIndexLayers.waterResources);
      break;
    case "Air Quality":
      url = map.makeUrl(environmentalPerformanceIndexLayers.airQuality);
      break;
    default:
      url = map.makeUrl(environmentalPerformanceIndexLayers.agriculture);
      break;
  }
  return { url, layerName };
};

//add legend on initial page load
map.addLegend(
  {
    layerName: "Agriculture",
    url: map.makeUrl(environmentalPerformanceIndexLayers.agriculture),
  },
  "legend",
  "map-header"
);
layerElement?.addEventListener("click", function () {
  const legendProperties = setLegendImageUrl();
  const layerName = legendProperties.layerName ?? "Environmental Performance";
  map.addLegend(
    { layerName: layerName, url: legendProperties.url },
    "legend",
    "map-header"
  );
});
