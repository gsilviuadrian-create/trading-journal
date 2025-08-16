// Variabile globale
let trades = []; // Array cu toate trade-urile
let cumulativeProfitChart, strategyPerformanceChart, profitDistributionChart; // Instanțe Chart.js

// Funcție pentru a încărca trade-urile de la backend
async function loadTrades() {
  try {
    const response = await fetch('/trades');
    trades = await response.json();
    updateTable();
    updateStats();
    updateCharts();
  } catch (err) {
    console.error('Eroare la încărcare trades:', err);
  }
}

// Funcție pentru a actualiza tabelul cu trade-uri filtrate
function updateTable() {
  const tbody = document.querySelector('#tradesTable tbody');
  tbody.innerHTML = ''; // Curăță tabelul

  // Aplică filtre
  const strategyFilter = document.getElementById('strategyFilter').value;
  const dateFilter = document.getElementById('dateFilter').value;
  const instrumentFilter = document.getElementById('instrumentFilter').value.toLowerCase();

  const filteredTrades = trades.filter(trade => {
    let match = true;
    if (strategyFilter && trade.strategy !== strategyFilter) match = false;
    if (dateFilter && trade.date !== dateFilter) match = false;
    if (instrumentFilter && !trade.instrument.toLowerCase().includes(instrumentFilter)) match = false;
    return match;
  });

  filteredTrades.forEach(trade => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border p-2">${trade.date}</td>
      <td class="border p-2">${trade.instrument}</td>
      <td class="border p-2">${trade.entryPrice}</td>
      <td class="border p-2">${trade.exitPrice}</td>
      <td class="border p-2">${trade.volume}</td>
      <td class="border p-2 ${trade.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}">${trade.profitLoss.toFixed(2)}</td>
      <td class="border p-2">${trade.strategy}</td>
      <td class="border p-2">${trade.emotions}</td>
    `;
    tbody.appendChild(row);
  });
}

// Funcție pentru a calcula și actualiza statisticile
function updateStats() {
  const totalTradesElem = document.getElementById('totalTrades');
  const winRateElem = document.getElementById('winRate');
  const totalProfitElem = document.getElementById('totalProfit');
  const avgProfitElem = document.getElementById('avgProfit');
  const maxDrawdownElem = document.getElementById('maxDrawdown');

  if (trades.length === 0) return;

  const total = trades.length;
  const wins = trades.filter(t => t.profitLoss > 0).length;
  const winRate = ((wins / total) * 100).toFixed(2);
  const totalProfit = trades.reduce((sum, t) => sum + t.profitLoss, 0).toFixed(2);
  const avgProfit = (totalProfit / total).toFixed(2);
  let maxDrawdown = 0;
  trades.forEach(t => {
    if (t.profitLoss < maxDrawdown) maxDrawdown = t.profitLoss; // Simplu: cea mai mare loss single pentru MVP
  });
  maxDrawdown = Math.abs(maxDrawdown).toFixed(2); // Facem pozitiv pentru display

  totalTradesElem.textContent = total;
  winRateElem.textContent = `${winRate}%`;
  totalProfitElem.textContent = `$${totalProfit}`;
  avgProfitElem.textContent = `$${avgProfit}`;
  maxDrawdownElem.textContent = `$${maxDrawdown}`;
}

// Funcție pentru a actualiza graficele cu Chart.js (animate implicit)
function updateCharts() {
  // Pregătește date pentru grafic linie: Profit cumulat lunar
  const monthlyProfit = {};
  trades.forEach(t => {
    const month = t.date.slice(0, 7); // YYYY-MM
    if (!monthlyProfit[month]) monthlyProfit[month] = 0;
    monthlyProfit[month] += t.profitLoss;
  });
  const months = Object.keys(monthlyProfit).sort();
  let cumulative = 0;
  const cumulativeData = months.map(m => cumulative += monthlyProfit[m]);

  if (cumulativeProfitChart) cumulativeProfitChart.destroy();
  cumulativeProfitChart = new Chart(document.getElementById('cumulativeProfitChart'), {
    type: 'line',
    data: {
      labels: months,
      datasets: [{ label: 'Profit Cumulat', data: cumulativeData, borderColor: '#2196F3', fill: false }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });

  // Grafic bar: Performanță pe strategie (profit total per strategie)
  const strategyProfit = { Scalping: 0, Swing: 0, 'Day Trading': 0 };
  trades.forEach(t => strategyProfit[t.strategy] += t.profitLoss);

  if (strategyPerformanceChart) strategyPerformanceChart.destroy();
  strategyPerformanceChart = new Chart(document.getElementById('strategyPerformanceChart'), {
    type: 'bar',
    data: {
      labels: Object.keys(strategyProfit),
      datasets: [{ label: 'Profit per Strategie', data: Object.values(strategyProfit), backgroundColor: '#4CAF50' }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });

  // Pie chart: Distribuție profit/loss
  const profitCount = trades.filter(t => t.profitLoss > 0).length;
  const lossCount = trades.filter(t => t.profitLoss < 0).length;
  const breakEven = trades.length - profitCount - lossCount;

  if (profitDistributionChart) profitDistributionChart.destroy();
  profitDistributionChart = new Chart(document.getElementById('profitDistributionChart'), {
    type: 'pie',
    data: {
      labels: ['Profit', 'Loss', 'Break Even'],
      datasets: [{ data: [profitCount, lossCount, breakEven], backgroundColor: ['#4CAF50', '#F44336', '#9E9E9E'] }]
    },
    options: { responsive: true }
  });
}

// Handle submit formular: Calculează profit/loss și trimite la backend
document.getElementById('tradeFormElement').addEventListener('submit', async (e) => {
  e.preventDefault();
  const date = document.getElementById('date').value;
  const instrument = document.getElementById('instrument').value;
  const entryPrice = parseFloat(document.getElementById('entryPrice').value);
  const exitPrice = parseFloat(document.getElementById('exitPrice').value);
  const volume = parseFloat(document.getElementById('volume').value);
  const strategy = document.getElementById('strategy').value;
  const emotions = document.getElementById('emotions').value;

  // Calcul automat profit/loss: (exit - entry) * volume (simplu, asumă long)
  const profitLoss = (exitPrice - entryPrice) * volume;

  const newTrade = { date, instrument, entryPrice, exitPrice, volume, profitLoss, strategy, emotions };

  try {
    await fetch('/trades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTrade)
    });
    document.getElementById('tradeForm').classList.add('hidden');
    loadTrades(); // Reîncarcă datele
  } catch (err) {
    console.error('Eroare la salvare trade:', err);
  }
});

// Toggle formular la click pe buton
document.getElementById('addTradeBtn').addEventListener('click', () => {
  document.getElementById('tradeForm').classList.toggle('hidden');
});

// Handle filtre: Reupdate tabel și stats la change
document.getElementById('strategyFilter').addEventListener('change', updateTable);
document.getElementById('dateFilter').addEventListener('change', updateTable);
document.getElementById('instrumentFilter').addEventListener('input', updateTable);

// Export CSV: Generează fișier din trades filtrate
document.getElementById('exportBtn').addEventListener('click', () => {
  // Folosește aceleași filtre ca în updateTable
  const strategyFilter = document.getElementById('strategyFilter').value;
  const dateFilter = document.getElementById('dateFilter').value;
  const instrumentFilter = document.getElementById('instrumentFilter').value.toLowerCase();

  const filteredTrades = trades.filter(trade => {
    let match = true;
    if (strategyFilter && trade.strategy !== strategyFilter) match = false;
    if (dateFilter && trade.date !== dateFilter) match = false;
    if (instrumentFilter && !trade.instrument.toLowerCase().includes(instrumentFilter)) match = false;
    return match;
  });

  const csvContent = 'data:text/csv;charset=utf-8,' 
    + 'Data,Instrument,Entry,Exit,Volum,Profit/Loss,Strategie,Emoții\n'
    + filteredTrades.map(t => `${t.date},${t.instrument},${t.entryPrice},${t.exitPrice},${t.volume},${t.profitLoss},${t.strategy},${t.emotions}`).join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'trades.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Încarcă inițial datele la load pagină
window.addEventListener('load', loadTrades);
