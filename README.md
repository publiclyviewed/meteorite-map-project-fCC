# Meteorite Landings Map

This project is a data visualization app that shows where meteorites have landed around the world using D3.js and TopoJSON. Each meteorite is represented by a circle on a world map, where the size indicates its mass. Hovering over a meteorite reveals detailed information.

## 🚀 Features

- **Interactive World Map**: Rendered with D3's Natural Earth projection.
- **Dynamic Data Points**: Meteorite strikes shown as scalable circles.
- **Informative Tooltips**: Hover for mass, name, year, and coordinates.
- **Clean, Responsive Layout**: Styled with vanilla CSS.

## 📦 Data Source
Meteorite data: [FreeCodeCamp Meteorite JSON](https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json)

World map TopoJSON: [World Atlas 110m](https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json)

## 🛠️ Technologies Used

- HTML5 / CSS3
- JavaScript (ES6+)
- [D3.js v7](https://d3js.org/)
- [TopoJSON](https://github.com/topojson/topojson-client)

## 🧭 How to Run It Locally

1. Clone this repo or copy the files:
   ```bash
   git clone https://github.com/publiclyviewed/meteorite-map-project-fCC.git
   cd meteorite-map
   ```

2. Open `index.html` in your browser.
   ```bash
   open index.html
   ```

## 📈 Potential Enhancements
- Add zoom and pan
- Filter by year or mass range
- Downloadable data on click

## 📄 License
MIT License. Free to use and modify.

---

Created as part of a freeCodeCamp data visualization challenge.
