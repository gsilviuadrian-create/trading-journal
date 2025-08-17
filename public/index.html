let trades = [];
let previousWinRate = 0;

function loadTrades() {
    fetch('/trades')
        .then(response => response.json())
        .then(data => {
            trades = data;
            updateTableAndStats();
        })
        .catch(error => console.error('Eroare:', error));
}

function updateTableAndStats() {
    const tableBody = document.querySelector('#tradesTable tbody');
    tableBody.innerHTML = '';
    let totalProfit = 0;
    let winCount = 0;

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

    const winRate = trades.length > 0 ? (winCount / trades.length * 100).toFixed(2) : 0;
    animateValue('winRate', 0, winRate, 500);
    animateValue('totalProfit', 0, totalProfit, 500, '$');
    animateValue('averageProfit', 0, trades.length > 0 ? (totalProfit / trades.length).toFixed(2) : 0, 500, '$');
    document.getElementById('maxDrawdown').textContent = '$0';
    document.getElementById('totalTrades').textContent = trades.length;

    updateWinRateArrow(winRate);
}

function animateValue(id, start, end, duration, prefix = '') {
    let startTimestamp = null;
    const element = document.getElementById(id);
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = start + (end - start) * progress;
        element.textContent = `${prefix}${value.toFixed(2)}`;
        if (progress < 1) window.requestAnimationFrame(step);
        else element.textContent = `${prefix}${end.toFixed(2)}`;
    };
    window.requestAnimationFrame(step);
}

function updateWinRateArrow(winRate) {
    const arrow = document.getElementById('winRateArrow');
    if (!arrow) {
        console.log('Eroare: Elementul winRateArrow nu există!');
        return;
    }
    if (winRate > previousWinRate) {
        arrow.textContent = '↑';
        arrow.style.color = 'green';
    } else if (winRate < previousWinRate) {
        arrow.textContent = '↓';
        arrow.style.color = 'red';
    } else {
        arrow.textContent = '→';
        arrow.style.color = 'gray';
    }
    previousWinRate = winRate;
}

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
    .then(data => loadTrades())
    .catch(error => console.error('Eroare:', error));
    this.reset();
});

loadTrades();
