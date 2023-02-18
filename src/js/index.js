const ctx = document.getElementById("myChart");
new Chart(ctx, {
  type: "doughnut",
  data: {
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
      },
    ],
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
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
