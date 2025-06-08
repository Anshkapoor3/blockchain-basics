
/**
 * Blockchain class managing the chain of blocks
 */
class Blockchain {
    constructor() {
        this.chain = [];
        this.createGenesisBlock();
    }

    /**
     * Create the first block (Genesis Block)
     */
    async createGenesisBlock() {
        const genesis = new Block(0, { 
            message: "Genesis Block - The beginning of our blockchain",
            creator: "Blockchain Demo",
            version: "1.0"
        }, "0");
        
        await genesis.calculateHash();
        this.chain.push(genesis);
        
        if (typeof log === 'function') {
            log("🎉 Genesis block created!");
        }
    }

    /**
     * Add a new block to the chain
     * @param {*} data - Data to store in the new block
     */
    async addBlock(data) {
        const previousBlock = this.getLatestBlock();
        const newBlock = new Block(this.chain.length, data, previousBlock.hash);
        
        await newBlock.calculateHash();
        this.chain.push(newBlock);
        
        if (typeof log === 'function') {
            log(`📦 Block ${newBlock.index} added to chain`);
        }
    }

    /**
     * Get the latest block in the chain
     * @returns {Block} - The latest block
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Validate the entire blockchain
     * @returns {Promise<boolean>} - True if the entire chain is valid
     */
    async isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            if (!(await currentBlock.isValid(previousBlock))) {
                return false;
            }
        }
        return true;
    }

    /**
     * Fix the blockchain by recalculating all hashes
     */
    async fixChain() {
        if (typeof log === 'function') {
            log("🔧 Recalculating all hashes to fix the chain...");
        }
        
        for (let i = 0; i < this.chain.length; i++) {
            if (i > 0) {
                this.chain[i].previousHash = this.chain[i - 1].hash;
            }
            await this.chain[i].calculateHash();
        }
        
        if (typeof log === 'function') {
            log("✅ Blockchain fixed!");
        }
    }

    /**
     * Get blockchain statistics
     * @returns {Object} - Chain statistics
     */
    getStats() {
        return {
            totalBlocks: this.chain.length,
            totalDataSize: this.chain.reduce((size, block) => 
                size + JSON.stringify(block.data).length, 0),
            isValid: this.isChainValid(),
            createdAt: this.chain[0]?.timestamp
        };
    }

    /**
     * Find a block by index
     * @param {number} index - Block index to find
     * @returns {Block|null} - The block if found, null otherwise
     */
    getBlockByIndex(index) {
        return this.chain.find(block => block.index === index) || null;
    }

    /**
     * Get the entire chain as a simple array
     * @returns {Array} - Array of block summaries
     */
    toArray() {
        return this.chain.map(block => block.getSummary());
    }
}
