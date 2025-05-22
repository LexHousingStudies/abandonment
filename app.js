window.onload = function() {
  const { Map } = maplibregl;
  const {DeckGL, ScatterplotLayer, ArcLayer, MapboxOverlay} = deck;
  const map = new Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    center: [-84.499819, 38.048976],
    zoom: 10.5,
  });
  map.addControl(new maplibregl.NavigationControl(), 'top-right');

  map.on('load', async () => {
    const response = await fetch("vacant_owners_allproperties.geojson");
    const responseJSON = await response.json();

  function linePartColor(d, mainColor, vprcColor) {
      if (d.properties.is_vprc === 'VPRC') {
        return vprcColor
      }

      return mainColor
    }
    const abandonmentLayer = new ArcLayer({
              id: 'abandonment-flows',
              data: responseJSON.features,
              getSourcePosition: d => [d.properties.start_x,d.properties.start_y],
              getTargetPosition: d => [d.properties.end_x,d.properties.end_y],
              getSourceColor: d => linePartColor(d, [217, 191, 13], [255, 0, 0]),
              getTargetColor: d => linePartColor(d, [30, 133, 83], [255, 0, 0]),
              getWidth: 1,
              pickable: true,
              autoHighlight: true,
              highlightColor: [77, 208, 225]
            })

            const abandonmentOverlay = new deck.MapboxOverlay({
              layers: [abandonmentLayer],
              getTooltip
              
          });
          map.addControl(abandonmentOverlay);
    
    const radioButtons = document.querySelectorAll('input[name="filter"]');
    radioButtons.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          console.log(`Selected value: ${radio.value}`);
          const filterTranslation = {
            "finnell":"21",
            "morton":"49",
            "omead":"54",
            "johnson":"37",
            "approp":"01",
            "lowkey":"44"
          }
          // Filter the data based on the selected radio button value
          if (radio.value === "all") {
            filteredData = responseJSON.features
          } else {
            filteredData = responseJSON.features.filter(feature => {
              return feature.properties.lexvacan_1 === filterTranslation[radio.value];
            });
          }
          const filteredLayer = new ArcLayer({
            id: 'filtered-abandonment-flows',
            data: filteredData,
            getSourcePosition: d => [d.properties.start_x,d.properties.start_y],
            getTargetPosition: d => [d.properties.end_x,d.properties.end_y],
            getSourceColor: d => linePartColor(d, [217, 191, 13], [255, 0, 0]),
            getTargetColor: d => linePartColor(d, [30, 133, 83], [255, 0, 0]),
            getWidth: 1,
            pickable: true,
            autoHighlight: true,
            highlightColor: [77, 208, 225]
          });
          abandonmentOverlay.setProps({
            layers: [filteredLayer]
          });
          // filterAbandonmentOverlayLayer(map, "abandonment-flows", radio.value)
          // You can perform further actions with the selected value here
        }
      });
    });
  })
}

function filterAbandonmentOverlayLayer(map, layer, selectedValue) {
  const filterTranslation = {
    "finnell":"21",
    "morton":"49",
    "omead":"54",
    "johnson":"37",
    "approp":"01",
    "lowkey":"44"
  }
  
}
function getTooltip({object}) {
  return object && {
    html: `
    <h2>${object.properties.address}</h2>
    <ul>
    <li>Owner: ${object.properties.lexvacan_2}</li>
    <li>PVA number: ${object.properties.pvanum}</li>
    </ul>
    `,
    style: {
      backgroundColor: '#121212',
      fontColor: '#fff',
      fontSize: '1rem'
    }
  };
}
