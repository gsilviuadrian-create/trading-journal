let trades = [];

// Funcție pentru a încărca trade-urile de pe server
function loadTrades() {
    fetch('/trades')
        .then(response => response.json())
        .then(data => {
            trades = data;
            updateTableAndStats();
        })
        .catch(error => console.error('Eroare la încărcarea trade-urilor:', error));
}

// Funcție pentru a actualiza tabelul și statisticile
function updateTableAndStats() {
    const tableBody = document.querySelector('#tradesTable tbody');
    tableBody.innerHTML = ''; // Golește tabelul
    let totalProfit = 0;
    let winCount = 0;

    // Completează tabelul cu trade-uri
    trades.forEach(trade => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = trade.Data || '';
        row.insertCell(1).textContent = trade.Instrument || '';
        row.insertCell(2).textContent = trade.Entry || '';
        row.insertCell(3).textContent = trade.Exit || '';
        row.insertCell(4).textContent = trade.Volum || '';
        row.insertCell(5).textContent = trade['Profit/Loss'] || 0;
        row.insertCell(6).textContent = trade.Strategie || '';
        row.insertCell(7).textContent = trade.Emotii || '';

        totalProfit += parseFloat(trade['Profit/Loss']) || 0;
        if (parseFloat(trade['Profit/Loss']) > 0) winCount++;
    });

    // Calculează și actualizează statisticile cu animație simplă
    const winRate = trades.length > 0 ? (winCount / trades.length * 100).toFixed(2) : 0;
    animateValue('winRate', 0, winRate, 500); // Animație pentru Win Rate
    animateValue('totalProfit', 0, totalProfit, 500, '$'); // Animație pentru Profit Total
    animateValue('averageProfit', 0, trades.length > 0 ? (totalProfit / trades.length).toFixed(2) : 0, 500, '$'); // Animație pentru Profit Mediu
    document.getElementById('maxDrawdown').textContent = '$0'; // De implementat mai târziu
    document.getElementById('totalTrades').textContent = trades.length; // Fără animație pentru număr
}

// Funcție pentru animație a valorilor
function animateValue(id, start, end, duration, prefix = '') {
    let startTimestamp = null;
    const element = document.getElementById(id);
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = start + (end - start) * progress;
        element.textContent = `${prefix}${value.toFixed(2)}`;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = `${prefix}${end.toFixed(2)}`;
        }
    };
    window.requestAnimationFrame(step);
}

// Eveniment pentru submit-ul formularului
document.getElementById('tradeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const newTrade = {
        Data: document.getElementById('date').value,
        Instrument: document.getElementById('instrument').value,
        Entry: document.getElementById('entry').value,
        Exit: document.getElementById('exit').value,
        Volum: document.getElementById('volume').value,
        'Profit/Loss': document.getElementById('profitLoss').value,
        Strategie: document.getElementById('strategy').value,
        Emotii: document.getElementById('emotions').value
    };

    fetch('/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrade)
    })
    .then(response => response.json())
    .then(data => {
        loadTrades(); // Reîncarcă trade-urile
        this.reset(); // Resetează formularul
    })
    .catch(error => console.error('Eroare la salvarea trade-ului:', error));
});

// Încarcă trade-urile la start
loadTrades();
