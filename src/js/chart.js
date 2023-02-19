const ctx = document.getElementById("myChart");
const createChart = (data, labels) => {
  let myChart = null;
  if (Chart.getChart("myChart")) {
    Chart.getChart("myChart").destroy();
  }
  myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [
        {
          label: "# of Votes",
          data: data,
          borderWidth: 1,
        },
      ],
      labels: labels,
      name: "Position: bottom",
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
};
export default createChart;
