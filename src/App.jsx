import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import { useEffect, useRef } from "react";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Sketch from "@arcgis/core/widgets/Sketch";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";

function App() {
  const mapRef = useRef();
  const sketchLayer = new GraphicsLayer();
  const map = new Map({
    basemap: "topo-vector",
    layers: [sketchLayer],
  });

  useEffect(() => {
    new MapView({
      map,
      center: [118.0148634, -2.548926],
      zoom: 5,
      container: mapRef.current,
    }).when((view) => {
      const sketchModel = new SketchViewModel({
        layer: sketchLayer,
        updateOnGraphicClick: false,
        defaultUpdateOptions: {
          toggleToolOnClick: false,
        },
      });
      const sketch = new Sketch({
        view: view,
        viewModel: sketchModel,
        creationMode: "update",
      });
      view.ui.add(sketch, "top-right");
      sketchModel.on(["update", "undo", "redo"], onGraphicUpdate);
    });
  }, []);

  function onGraphicUpdate(event) {
    // const graphic = event.graphics[0];

    let layerExtent = calculateGraphicsLayerExtent(sketchLayer);
    console.log("xmax: ", layerExtent.xmax);
    console.log("ymax: ", layerExtent.ymax);
    console.log("xmin: ", layerExtent.xmin);
    console.log("ymin: ", layerExtent.ymin);
  }

  function calculateGraphicsLayerExtent(graphicsLayer) {
    let extent = null;

    graphicsLayer.graphics.forEach((graphic) => {
      if (!extent) {
        extent = graphic.geometry.extent.clone();
      } else {
        extent = extent.union(graphic.geometry.extent);
      }
    });

    return extent;
  }

  return (
    <div className="container" ref={mapRef}>
      <div className="bottombar"></div>
    </div>
  );
}

export default App;
