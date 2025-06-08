
/**
 * Main application logic and UI interactions
 */

let blockchain;

/**
 * Initialize the blockchain with sample data
 */
async function initializeBlockchain() {
    try {
        blockchain = new Blockchain();
        
        // Wait for genesis block creation
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Add sample blocks
        await blockchain.addBlock({ 
            message: "Second block with transaction data",
            transactions: [
                { from: "Alice", to: "Bob", amount: 10 },
                { from: "Charlie", to: "Dave", amount: 5 }
            ],
            blockSize: "1.2KB"
        });
        
        await blockchain.addBlock({ 
            message: "Third block with more complex data",
            transactions: [
                { from: "Eve", to: "Frank", amount: 15 }
            ],
            metadata: { 
                difficulty: 4,
                miner: "Miner001",
                reward: 12.5
            },
            blockSize: "2.1KB"
        });
        
        await renderBlockchain();
        log("🚀 Blockchain initialized with 3 blocks!");
        
    } catch (error) {
        console.error('Error initializing blockchain:', error);
        log("❌ Error initializing blockchain: " + error.message);
    }
}

/**
 * Render the blockchain in the UI
 */
async function renderBlockchain() {
    const container = document.getElementById('blockchain');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < blockchain.chain.length; i++) {
        const block = blockchain.chain[i];
        const isValid = i === 0 ? true : await block.isValid(blockchain.chain[i - 1]);
        
        const blockDiv = createBlockElement(block, isValid, i < blockchain.chain.length - 1);
        container.appendChild(blockDiv);
    }
}

/**
 * Create a DOM element for a block
 * @param {Block} block - The block to render
 * @param {boolean} isValid - Whether the block is valid
 * @param {boolean} showArrow - Whether to show the chain arrow
 * @returns {HTMLElement} - The block DOM element
 */
function createBlockElement(block, isValid, showArrow) {
    const blockDiv = document.createElement('div');
    blockDiv.className = `block ${isValid ? 'valid' : 'invalid'}`;
    
    blockDiv.innerHTML = `
        <div class="block-header">Block ${block.index}</div>
        <div class="block-field">
            <span class="field-label">Index:</span> ${block.index}
        </div>
        <div class="block-field">
            <span class="field-label">Timestamp:</span> ${new Date(block.timestamp).toLocaleString()}
        </div>
        <div class="block-field">
            <span class="field-label">Data:</span> 
            <pre>${JSON.stringify(block.data, null, 2)}</pre>
        </div>
        <div class="block-field">
            <span class="field-label">Previous Hash:</span> 
            <div class="hash">${block.previousHash}</div>
        </div>
        <div class="block-field">
            <span class="field-label">Hash:</span> 
            <div class="hash">${block.hash}</div>
        </div>
        <div class="block-field">
            <span class="field-label">Nonce:</span> ${block.nonce}
        </div>
        <div class="block-field">
            <span class="field-label">Status:</span> 
            <span style="color: ${isValid ? '#2ed573' : '#ff4757'}">
                ${isValid ? '✅ Valid' : '❌ Invalid'}
            </span>
        </div>
        ${showArrow ? '<div class="chain-arrow">→</div>' : ''}
    `;
    
    return blockDiv;
}

/**
 * Tamper with Block 1 to demonstrate chain integrity
 */
async function tamperWithBlock1() {
    if (!blockchain || blockchain.chain.length <= 1) {
        log("❌ No blockchain or insufficient blocks to tamper with");
        return;
    }
    
    try {
        const block1 = blockchain.chain[1];
        const originalData = JSON.stringify(block1.data);
        
        // Modify the block data
        block1.data = { 
            message: "🚨 TAMPERED DATA - This block has been modified!",
            transactions: [
                { from: "Hacker", to: "Victim", amount: 1000, note: "Malicious transaction" }
            ],
            tamperedAt: new Date().toISOString(),
            originalData: "Data has been compromised"
        };
        
        log(`🚨 Block 1 data tampered!`);
        log(`Original data size: ${originalData.length} characters`);
        log(`New data size: ${JSON.stringify(block1.data).length} characters`);
        log("❗ Notice how this breaks the chain integrity!");
        
        await renderBlockchain();
        
    } catch (error) {
        console.error('Error tampering with block:', error);
        log("❌ Error tampering with block: " + error.message);
    }
}

/**
 * Fix the blockchain by recalculating hashes
 */
async function fixBlockchain() {
    if (!blockchain) {
        log("❌ No blockchain to fix");
        return;
    }
    
    try {
        await blockchain.fixChain();
        await renderBlockchain();
    } catch (error) {
        console.error('Error fixing blockchain:', error);
        log("❌ Error fixing blockchain: " + error.message);
    }
}

/**
 * Reset the blockchain to its initial state
 */
async function resetBlockchain() {
    try {
        log("🔄 Resetting blockchain...");
        await initializeBlockchain();
    } catch (error) {
        console.error('Error resetting blockchain:', error);
        log("❌ Error resetting blockchain: " + error.message);
    }
}

/**
 * Log a message to the activity log
 * @param {string} message - Message to log
 */
function log(message) {
    const logDiv = document.getElementById('log');
    if (!logDiv) return;
    
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
    
    logDiv.appendChild(entry);
    logDiv.scrollTop = logDiv.scrollHeight;
}

/**
 * Initialize the application when the page loads
 */
window.addEventListener('load', () => {
    initializeBlockchain().catch(error => {
        console.error('Failed to initialize blockchain:', error);
        log("❌ Failed to initialize blockchain");
    });
});

// Expose functions globally for button onclick handlers
window.tamperWithBlock1 = tamperWithBlock1;
window.fixBlockchain = fixBlockchain;
window.resetBlockchain = resetBlockchain;
