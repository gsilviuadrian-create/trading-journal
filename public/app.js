let trades = [];
let previousWinRate = 0;

function updateStats() {
    // Simulare date pentru test
    trades = [{ 'Profit/Loss': 10 }, { 'Profit/Loss': -5 }, { 'Profit/Loss': 15 }]; // Date test
    let totalProfit = 0;
    let winCount = 0;

    trades.forEach(trade => {
        totalProfit += parseFloat(trade['Profit/Loss']) || 0;
        if (parseFloat(trade['Profit/Loss']) > 0) winCount++;
    });

    const winRate = trades.length > 0 ? (winCount / trades.length * 100).toFixed(2) : 0;
    const profitPercentage = trades.length > 0 ? (totalProfit / (trades.length * 20) * 100).toFixed(2) : 0; // Simulare procent

    document.getElementById('winRate').textContent = `${winRate}%`;
    document.getElementById('totalProfit').textContent = `$${totalProfit.toFixed(2)}`;

    // Ajustăm lățimea semicercului pentru a reflecta profitul/pierderile
    const semicircle = document.querySelector('.stats-semicircle::before');
    const greenWidth = (profitPercentage > 0 ? Math.min(profitPercentage, 50) : 0) + '%';
    const redWidth = (profitPercentage < 0 ? Math.min(-profitPercentage, 50) : 0) + '%';
    semicircle.style.background = `linear-gradient(to right, red ${redWidth}, red ${redWidth}, green 50%, green ${greenWidth})`;
}

updateStats();
