interface LayerProperties {
  layerUrl: string;
  options: L.TileLayerOptions;
  layerName: string;
}

class MapHandles {
  mapView: L.Map;
  baseUrl: string;
  constructor(
    element: string,
    baseUrl: string,
    options?: L.MapOptions | undefined
  ) {
    //create map view
    this.mapView = L.map(element, {
      ...options,
    });
    this.baseUrl = baseUrl;
  }

  makeRequest = async (url: string) => {
    let res = await fetch(url);
    return res.json();
  };

  createTileLayers(tileLayerProperties: LayerProperties[]) {
    //let layers: L.TileLayer[] = [];
    for (let tileLayerProperty of tileLayerProperties) {
      const layer = L.tileLayer(tileLayerProperty.layerUrl, {
        ...tileLayerProperty.options,
      }).addTo(this.mapView);
      //layers.push(layer);
    }
    //return layers
  }
  //add wms tile layer
  addTileLayerWMS(tileLayerProperties: L.WMSOptions | undefined) {
    const layer = L.tileLayer.wms(this.baseUrl, {
      layers: tileLayerProperties?.layers,
      format: "image/jpeg",
      transparent: false,
      opacity: 1,
      attribution:
        '<a href="https://sedac.ciesin.columbia.edu/maps/services">Sedac</a>',
    });
    return layer;
  }
  makeUrl(layer: string) {
    return `https://sedac.ciesin.columbia.edu/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=10&LAYER=${layer}&legend_options=fontName:Times%20New%20Roman;fontAntiAliasing:true;fontColor:0x000033;fontSize:7;bgColor:0xFFFFEE;dpi:180`;
  }
  wfsRequest(url: string) {
    this.makeRequest(url).then((data) =>
      L.geoJson(data, {
        onEachFeature: (feature) => {
          console.log(feature);
        },
      }).addTo(this.mapView)
    );
  }
  addLegend(
    legendProperties: { layerName: string; url: string },
    legendClass: string,
    mapHeaderClass: string
  ) {
    const legendDiv = document.getElementsByClassName(legendClass);
    const mapHeader = document.getElementById(mapHeaderClass)!;
    if (legendDiv.length) {
      for (let item of legendDiv) {
        item.remove();
      }
    }

    let legend = new L.Control({ position: "bottomleft" });
    legend.onAdd = function (map) {
      let div = L.DomUtil.create("div", legendClass);
      let img = L.DomUtil.create("img", "legendImage");
      img.setAttribute("src", legendProperties.url);
      //set map header to layer title
      mapHeader.innerText = legendProperties.layerName;
      div.appendChild(img);
      return div;
    };
    legend.addTo(this.mapView);
  }
}
