
/**
 * Block class representing a single block in the blockchain
 */
class Block {
    /**
     * Create a new block
     * @param {number} index - Position in the blockchain
     * @param {*} data - Data to store in the block
     * @param {string} previousHash - Hash of the previous block
     */
    constructor(index, data, previousHash = '') {
        this.index = index;
        this.timestamp = new Date().toISOString();
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = '';
    }

    /**
     * Calculate the hash for this block
     * @returns {Promise<string>} - The calculated hash
     */
    async calculateHash() {
        const blockString = this.index + 
                          this.timestamp + 
                          JSON.stringify(this.data) + 
                          this.previousHash + 
                          this.nonce;
        
        this.hash = await sha256(blockString);
        return this.hash;
    }

    /**
     * Check if this block is valid
     * @param {Block|null} previousBlock - The previous block in the chain
     * @returns {Promise<boolean>} - True if block is valid
     */
    async isValid(previousBlock = null) {
        // Store current hash
        const currentHash = this.hash;
        
        // Recalculate hash to verify integrity
        await this.calculateHash();
        const isHashValid = currentHash === this.hash;
        
        // Verify previous hash connection
        const isPreviousHashValid = previousBlock ? 
            this.previousHash === previousBlock.hash : 
            this.previousHash === '0' || this.previousHash === '';
        
        return isHashValid && isPreviousHashValid;
    }

    /**
     * Get a summary of the block
     * @returns {Object} - Block summary
     */
    getSummary() {
        return {
            index: this.index,
            timestamp: this.timestamp,
            dataSize: JSON.stringify(this.data).length,
            previousHash: this.previousHash.substring(0, 8) + '...',
            hash: this.hash.substring(0, 8) + '...',
            nonce: this.nonce
        };
    }

    /**
     * Create a deep copy of the block
     * @returns {Block} - A new Block instance with the same data
     */
    clone() {
        const clonedBlock = new Block(this.index, JSON.parse(JSON.stringify(this.data)), this.previousHash);
        clonedBlock.timestamp = this.timestamp;
        clonedBlock.nonce = this.nonce;
        clonedBlock.hash = this.hash;
        return clonedBlock;
    }
}
