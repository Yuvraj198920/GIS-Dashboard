const temperatureCtx = document
  .getElementById("temperatureChart")
  .getContext("2d");
const humidityCtx = document.getElementById("humidityChart").getContext("2d");

const temperatureChart = new Chart(temperatureCtx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          tooltipFormat: "ll HH:mm",
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
    },
  },
});

const humidityChart = new Chart(humidityCtx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Humidity (%)",
        data: [],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          tooltipFormat: "ll HH:mm",
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Humidity (%)",
        },
      },
    },
  },
});

function updateCharts(data) {
  const labels = data.hourly.time.map((time) => new Date(time));
  const temperatureData = data.hourly.temperature_2m;
  const humidityData = data.hourly.humidity_2m;

  temperatureChart.data.labels = labels;
  temperatureChart.data.datasets[0].data = temperatureData;
  temperatureChart.update();

  humidityChart.data.labels = labels;
  humidityChart.data.datasets[0].data = humidityData;
  humidityChart.update();
}
