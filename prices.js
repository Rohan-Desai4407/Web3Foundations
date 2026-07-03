import './style.css';

const COINS = [
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', icon: 'https://assets.coingecko.com/coins/images/16547/small/arbitrum.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', icon: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' }
];

const priceContainer = document.getElementById('priceContainer');
const refreshBtn = document.getElementById('refreshBtn');

async function fetchPrices() {
  priceContainer.innerHTML = '<p>Loading prices...</p>';
  try {
    const ids = COINS.map(c => c.id).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    renderPrices(data);
  } catch (error) {
    console.error('Error fetching prices:', error);
    priceContainer.innerHTML = '<p style="color: var(--danger);">Failed to load prices. Please try again later.</p>';
  }
}

function renderPrices(data) {
  priceContainer.innerHTML = '';
  
  COINS.forEach(coin => {
    const coinData = data[coin.id];
    if (!coinData) return;
    
    const price = coinData.usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const change = coinData.usd_24h_change;
    const isPositive = change >= 0;
    const changeClass = isPositive ? 'positive' : 'negative';
    const arrow = isPositive ? '▲' : '▼';
    
    const card = document.createElement('div');
    card.className = 'glass-card price-card';
    card.innerHTML = `
      <img src="${coin.icon}" alt="${coin.name} logo" />
      <h3>${coin.name} (${coin.symbol})</h3>
      <div class="price-value">${price}</div>
      <div class="change ${changeClass}">
        ${arrow} ${Math.abs(change).toFixed(2)}%
      </div>
    `;
    priceContainer.appendChild(card);
  });
}

// Initial fetch
fetchPrices();

// Refresh listener
refreshBtn.addEventListener('click', () => {
  fetchPrices();
});
