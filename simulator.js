import './style.css';

const blockNumInput = document.getElementById('blockNum');
const nonceInput = document.getElementById('nonce');
const blockDataInput = document.getElementById('blockData');
const hashOutput = document.getElementById('hashOutput');
const mineBtn = document.getElementById('mineBtn');
const blockCard = document.getElementById('blockCard');

// Utility to calculate SHA-256 hash using Web Crypto API
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Update the hash in real-time
async function updateHash() {
  const block = blockNumInput.value;
  const nonce = nonceInput.value;
  const data = blockDataInput.value;
  
  const payload = block + nonce + data;
  const hash = await sha256(payload);
  
  hashOutput.textContent = hash;
  
  // Check if hash is valid (starts with 4 zeros)
  if (hash.startsWith('0000')) {
    hashOutput.classList.remove('invalid');
    blockCard.style.boxShadow = '0 8px 32px 0 rgba(16, 185, 129, 0.37)'; // Green glow
  } else {
    hashOutput.classList.add('invalid');
    blockCard.style.boxShadow = '0 8px 32px 0 rgba(239, 68, 68, 0.37)'; // Red glow
  }
}

// Mining function
async function mineBlock() {
  mineBtn.disabled = true;
  mineBtn.textContent = 'Mining...';
  
  const block = blockNumInput.value;
  const data = blockDataInput.value;
  let nonce = 0;
  let hash = '';
  
  // Using a timeout loop to prevent UI freezing
  const mineStep = async () => {
    for (let i = 0; i < 500; i++) {
      const payload = block + nonce + data;
      hash = await sha256(payload);
      if (hash.startsWith('0000')) {
        nonceInput.value = nonce;
        updateHash();
        mineBtn.disabled = false;
        mineBtn.textContent = 'Mine Block';
        return;
      }
      nonce++;
    }
    
    // Update UI every 500 hashes
    nonceInput.value = nonce;
    updateHash();
    setTimeout(mineStep, 0);
  };
  
  mineStep();
}

// Event Listeners
blockNumInput.addEventListener('input', updateHash);
nonceInput.addEventListener('input', updateHash);
blockDataInput.addEventListener('input', updateHash);
mineBtn.addEventListener('click', mineBlock);

// Initial hash calculation
updateHash();
