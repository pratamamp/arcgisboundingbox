import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import { useEffect, useRef, useState } from "react";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Sketch from "@arcgis/core/widgets/Sketch";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import Expand from "@arcgis/core/widgets/Expand";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils.js";

function App() {
  const mapRef = useRef();
  const sketchLayer = new GraphicsLayer();
  const map = new Map({
    basemap: "topo-vector",
    layers: [sketchLayer],
  });
  const [selectExtent, setExtent] = useState();

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

      const expand = new Expand({
        view: view,
        content: document.getElementById("info"),
        expanded: true,
      });

      view.ui.add(expand, "top-right");
    });
  }, []);

  function onGraphicUpdate(event) {
    // const graphic = event.graphics[0];
    let extent = null;
    sketchLayer.graphics.forEach((graphic) => {
      let converts = webMercatorUtils.webMercatorToGeographic(graphic.geometry);
      if (!extent) {
        extent = converts.extent.clone();
      } else {
        extent = extent.union(converts.extent);
      }
      // if (!extent) {
      //   extent = graphic.geometry.extent.clone();
      // } else {
      //   extent = extent.union(graphic.geometry.extent);
      // }
    });

    setExtent(extent);
    return;
  }

  return (
    <div className="container" ref={mapRef}>
      <div
        id="info"
        style={{
          width: "20em",
          height: "120px",
          backgroundColor: "white",
          padding: "1em",
        }}
      >
        <ul style={{ listStyle: "none" }}>
          <li>
            <p>
              <b>xmin: </b>
              {selectExtent?.xmin}
            </p>
          </li>
          <li>
            <p>
              <b>ymin: </b>
              {selectExtent?.ymin}
            </p>
          </li>
          <li>
            <p>
              <b>xmax: </b>
              {selectExtent?.xmax}
            </p>
          </li>
          <li>
            <p>
              <b>ymax: </b>
              {selectExtent?.ymax}
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
