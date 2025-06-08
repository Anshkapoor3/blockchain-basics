
/**
 * Cryptographic utilities for blockchain hashing
 */

/**
 * Generate SHA-256 hash from a string
 * @param {string} message - The message to hash
 * @returns {Promise<string>} - The SHA-256 hash in hexadecimal
 */
async function sha256(message) {
    try {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
        console.error('Error generating SHA-256 hash:', error);
        throw error;
    }
}

/**
 * Validate hash format (64 character hexadecimal string)
 * @param {string} hash - The hash to validate
 * @returns {boolean} - True if valid hash format
 */
function isValidHashFormat(hash) {
    return /^[a-f0-9]{64}$/.test(hash);
}

