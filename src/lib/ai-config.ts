/**
 * AI Provider Configuration
 * 
 * This file controls which AI provider is used for investment analysis.
 * Switch between Claude (Anthropic) and Gemini (Google) here.
 */

export const AI_CONFIG = {
    /**
     * Current AI Provider
     * 
     * Options:
     * - 'claude'  → Uses Anthropic's Claude API (high quality, paid)
     * - 'gemini'  → Uses Google's Gemini API (free tier available)
     * 
     * To switch providers, simply change this value.
     */
    provider: 'gemini' as 'claude' | 'gemini',

    /**
     * Provider Endpoints
     * These are automatically selected based on the provider above
     */
    endpoints: {
        claude: '/api/buffett/claude',
        gemini: '/api/buffett/gemini',
    },

    /**
     * Provider Display Names and Models
     */
    models: {
        claude: 'Claude 3.7 Sonnet',
        gemini: 'Gemini 2.5 Flash',
    },

    /**
     * Get the current endpoint based on selected provider
     */
    getEndpoint() {
        return this.endpoints[this.provider];
    },

    /**
     * Get display name for current provider
     */
    getProviderName() {
        return this.provider === 'claude' ? 'Claude' : 'Gemini';
    },

    /**
     * Get model name for current provider
     */
    getModelName() {
        return this.models[this.provider];
    },
} as const;

/**
 * Usage Example:
 * 
 * To switch from Claude to Gemini:
 * 1. Change provider to 'gemini'
 * 2. Ensure GEMINI_API_KEY is set in .env.local
 * 3. Restart the dev server
 * 
 * To switch back to Claude:
 * 1. Change provider to 'claude'
 * 2. Ensure CLAUDE_API_KEY is set in .env.local
 * 3. Restart the dev server
 */
