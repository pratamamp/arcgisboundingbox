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
  const contentRef = useRef();
  const sketchLayer = new GraphicsLayer();
  const map = new Map({
    basemap: "topo-vector",
    layers: [sketchLayer],
  });
  const [selectExtent, setExtent] = useState();
  const [paramBody, setParam] = useState();

  const datas = [
    {
      name: "HERE",
      servicelink:
        "https://2.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/png8?app_id=eAdkWGYRoc4RfxVo0Z4B&app_code=TrLJuXVK62IQk0vuXFzaig&lg=eng",
      zoom: 20,
    },
    {
      name: "Mappa/Google",
      servicelink: "https://mappa.id/main/ortho/all/{x}/{y}/{z}",
      zoom: 19,
    },
    {
      name: "Planet",
      servicelink:
        "https://tiles.planet.com/basemaps/v1/planet-tiles/planet_medres_visual_2023-06_mosaic/gmap/{z}/{x}/{y}.png?api_key=PLAK97ed222fdcf543f7b47d2f667259c2ef&token=eyJraWQiOiJ3WWZ2U05rYnBsdGlVdExpVHNwaEJPNkt5d2t1RFJXX29kbW1SWVJzVmR3IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnk1RC1YTW9sVjlkcjFsMWhZMlRZc3JhYy1MS2d6TkYxWDRuQ29XdDNvRFUiLCJpc3MiOiJodHRwczovL2FjY291bnQucGxhbmV0LmNvbS9vYXV0aDIvYXVzMmVuaHd1ZUZZUmI1MFM0eDciLCJhdWQiOiJodHRwczovL2FwaS5wbGFuZXQuY29tLyIsInN1YiI6ImFndW5nLmJlc3RpQHN0dWRlbnQudW5qYW5pLmFjLmlkIiwiaWF0IjoxNjkxNjgzNDg2LCJleHAiOjE2OTE2ODcwODYsImNpZCI6IjBvYWJnajRhMWpGWHltZFhBNHg3IiwidWlkIjoiMDB1ZTBrZ3Rxam9KQ1MxZFo0eDciLCJzY3AiOlsicGxhbmV0IiwicHJvZmlsZSIsIm9wZW5pZCIsImVtYWlsIl0sImF1dGhfdGltZSI6MTY5MTY4MzQ4MiwiYXBpX2tleSI6IlBMQUs5N2VkMjIyZmRjZjU0M2Y3YjQ3ZDJmNjY3MjU5YzJlZiIsInVzZXJfaWQiOjQ3MzQzNywib3JnYW5pemF0aW9uX2lkIjo0NTI5MzMsInBsX3ByaW5jaXBhbCI6InBybjphZG1pbjpwcmluY2lwYWw6dXNlcjo0NzM0MzciLCJyb2xlX2xldmVsIjoxMDB9.bOfuc0OoSp32A8OrcVio_vvSl-UWDG0WjGYT98zLblvihmlQS7JdYSTIXL5Frv3Us9qs0LtUbWMF7djHI5YBIX4k1C5NRXUuevssM5aRNAlHBKVn8p-tGTJtLnNP4yBuVsHUmGbELDaWQk4IVWImK94olN9vu0LdwFcFSOGjrCkQLoyprhZdecUaNO54bemE2Fx5tLjIVsf4rXoSY4Q1KoUsTYxbVpFhZu1iwvqs_Qrezo4FHvy73zsCFNinyQbvCLuMVppA8IDmFI9HiIbBq_KNdajQ54iVDRf8ZU4gWQ9HJbQwzqZ22o-CsGEwzJeTiOFk9L_vzRX8wx2Hv1ctfA",
      zoom: 18,
    },
    {
      name: "atrbpn",
      servicelink: "https://spprbpn.net/csrt/jpg3/{x}/{y}/{z}",
      zoom: 21,
    },
    {
      name: "BING",
      servicelink:
        "https://t0.tiles.virtualearth.net/tiles/a{q}.jpeg?g=685&mkt=en-us&n=z",
      zoom: 19,
    },
    {
      name: "ESRI",
      servicelink:
        "https://{switch:services,server}.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      zoom: 22,
    },
    {
      name: "Yandex",
      servicelink:
        "https://core-sat.maps.yandex.net/tiles?l=sat&v=3.1025.0&x={x}&y={y}&z={z}&scale=1&lang=ru_RU",
      zoom: 19,
    },
  ];
  useEffect(() => {
    if (mapRef.current) {
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
          content: contentRef.current,
          expanded: true,
        });

        view.ui.add(expand, "top-right");
      });
    }
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
    });

    setExtent({
      lon_min: extent.ymin,
      lon_max: extent.ymax,
      lat_min: extent.xmin,
      lat_max: extent.ymax,
    });
    return;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...selectExtent,
        ...paramBody,
      }),
    };

    await fetch("http://localhost:5000/post", requestOption)
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  function handleChange(e) {
    const x = document.getElementById("selsource").value;

    const reqs = {
      tile_source: datas[x].servicelink,
      name_file: datas[x].name,
      zoom: datas[x].zoom,
    };
    setParam(reqs);
  }

  return (
    <div className="w-full h-screen">
      <div className="w-full h-full" ref={mapRef}></div>
      <div className="bg-white p-4 w-80" ref={contentRef}>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <select
            name="source"
            id="selsource"
            className="w-full"
            onChange={handleChange}
          >
            <option value="0">-- Select Source --</option>
            {datas.map((data, index) => {
              return (
                <option value={index + 1} key={index}>
                  {data.name}
                </option>
              );
            })}
          </select>
          <ul className="list-none space-y-2">
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
          <button
            className="px-3 py-2 rounded-md text-white bg-indigo-500"
            type="submit"
          >
            Download
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
