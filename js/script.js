async function getDashboardData() {
  const response = await fetch("./data.json");
  const data = await response.json();

  const cardsContainer = document.getElementById("cards-container");

  // ساخت کارت‌ها
  data.cards.forEach((card) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <h3>${card.title}</h3>
      <p>${card.count}</p>
      <div class="card-stats ${
        card.status === "increase" ? "positive" : "negative"
      }">
        ${card.status === "increase" ? "⬆" : "⬇"} ${Math.abs(card.percentage)}%
      </div>
    `;
    cardsContainer.appendChild(div);
  });

  // بار چارت (میله‌ای)
  const barCtx = document.getElementById("barChart").getContext("2d");
  new Chart(barCtx, {
    type: "bar",
    data: {
      labels: data.chart.labels,
      datasets: [
        {
          label: "تعداد سفارش‌ها",
          data: data.chart.data,
          backgroundColor: "#3366ff",
        },
      ],
    },
    options: { responsive: true },
  });

  // پای چارت (دایره‌ای)
  const pieCtx = document.getElementById("pieChart").getContext("2d");
  new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: data.cards.map((c) => c.title),
      datasets: [
        {
          data: data.cards.map((c) => Math.abs(c.percentage)),
          backgroundColor: ["#3366ff", "#ff5733", "#4caf50", "#f39c12"],
        },
      ],
    },
    options: { responsive: true },
  });

  // جدول کاربران
  const tbody = document.querySelector("#users-table tbody");
  data.table.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
    `;
    tbody.appendChild(tr);
  });
}

getDashboardData();
