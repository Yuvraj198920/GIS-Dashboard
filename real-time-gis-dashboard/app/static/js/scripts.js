let map = L.map("map").setView([51.505, -0.09], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

let searchPerformed = false;

const socket = io.connect("http://" + document.domain + ":" + location.port);
socket.on("update", function (data) {
  console.log("Data received:", data);
  // If search has been performed, don't reset the map view
  if (!searchPerformed) {
    // Example of adding a marker with the data
    const temperature = data.hourly.temperature_2m[0];
    const marker = L.marker([51.505, -0.09])
      .addTo(map)
      .bindPopup("Temperature: " + temperature + "°C")
      .openPopup();
  }

  // Update charts
  updateCharts(data);

  // Update data table
  updateDataTable(data);
});

function updateDataTable(data) {
  console.log("Updating data table with data:", data);
  if (!data.hourly || !data.hourly.time) {
    console.error("Data structure is incorrect:", data);
    return;
  }
  const table = $("#data-table").DataTable();
  table.clear();

  data.hourly.time.forEach((time, index) => {
    const temperature = data.hourly.temperature_2m[index];
    const humidity = data.hourly.humidity_2m
      ? data.hourly.humidity_2m[index]
      : "N/A";
    table.row.add([time, temperature, humidity]);
  });

  table.draw();
}

$(document).ready(function () {
  $("#data-table").DataTable({
    columns: [
      { title: "Time" },
      { title: "Temperature (°C)" },
      { title: "Humidity (%)" },
    ],
  });
});

function searchLocation(event) {
  event.preventDefault();
  const searchInput = document.getElementById("search-input").value;
  if (searchInput) {
    $.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${searchInput}`,
      function (data) {
        if (data.length > 0) {
          const lat = data[0].lat;
          const lon = data[0].lon;
          map.setView([lat, lon], 13);
          L.marker([lat, lon])
            .addTo(map)
            .bindPopup(`${searchInput}`)
            .openPopup();
          searchPerformed = true; // Set the state to indicate a search has been performed
        } else {
          alert("Location not found");
        }
      }
    );
  }
}

function fetchNewData(lat, lon) {
  $.get(`/data?lat=${lat}&lon=${lon}`, function (data) {
    console.log("New data for searched location:", data);

    // Update charts and data table with new data
    updateCharts(data);
    updateDataTable(data);
  });
}
