# 🔄 Switching Between AI Providers

This guide shows you how to switch between Claude and Gemini AI providers.

---

## Quick Switch Guide

### Step 1: Set API Keys

Make sure you have the required API key in your `.env.local`:

**For Claude:**
```env
CLAUDE_API_KEY=sk-ant-api03-...
```

**For Gemini:**
```env
GEMINI_API_KEY=AIzaSy...
```

See [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md) for how to obtain these keys.

---

### Step 2: Change AI Provider

Open `src/lib/ai-config.ts` and change the `provider` value:

**To use Claude:**
```typescript
provider: 'claude' as 'claude' | 'gemini',
```

**To use Gemini:**
```typescript
provider: 'gemini' as 'claude' | 'gemini',
```

---

### Step 3: Restart Development Server

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

That's it! The app will now use your selected AI provider.

---

## 📊 Provider Comparison

### Claude (Anthropic)

**Pros:**
- ✅ Exceptional quality responses
- ✅ Very consistent JSON formatting
- ✅ Deep reasoning capabilities
- ✅ Great at following complex instructions

**Cons:**
- ❌ Pay-as-you-go pricing (~$3 per million tokens)
- ❌ No free tier (only $5 initial credit)
- ❌ Can be expensive for high volume

**Best For:**
- Production environments
- When quality is critical
- Professional/commercial use

**API Endpoint:** `/api/buffett/claude`

---

### Gemini (Google)

**Pros:**
- ✅ **FREE tier** (15 requests/minute, 1500/day)
- ✅ Fast response times
- ✅ Native JSON mode (structured output)
- ✅ No credit card required for free tier
- ✅ Good for development/testing

**Cons:**
- ⚠️ Quality may vary compared to Claude
- ⚠️ Less consistent with complex instructions
- ⚠️ Newer model, still evolving

**Best For:**
- Development and testing
- Personal projects
- Learning and experimentation
- Budget-conscious applications

**API Endpoint:** `/api/buffett/gemini`

---

## 💡 Recommended Setup

### Development/Testing
```typescript
// src/lib/ai-config.ts
provider: 'gemini'  // Free tier, no credit card needed
```

### Production
```typescript
// src/lib/ai-config.ts
provider: 'claude'  // Higher quality for end users
```

---

## 🔍 Testing Your Provider

After switching providers, test the integration:

1. **Start the dev server:** `npm run dev`
2. **Open the app:** http://localhost:3000
3. **Search for a stock** (e.g., "AAPL")
4. **Generate a report** and check the AI analysis
5. **Verify the response quality** meets your needs

---

## 🐛 Troubleshooting

### "API Key not found" Error

**For Claude:**
- Verify `CLAUDE_API_KEY` is set in `.env.local`
- Check the key is valid at [Anthropic Console](https://console.anthropic.com/)

**For Gemini:**
- Verify `GEMINI_API_KEY` is set in `.env.local`
- Check the key is valid at [AI Studio](https://aistudio.google.com/app/apikey)

### Response Format Errors

Both providers are configured to return the same format:
```json
{
  "signal": "bullish" | "neutral" | "bearish",
  "confidence": 0-100,
  "reasoning": "string (max 1500 chars)"
}
```

If you get parsing errors:
1. Check the API key is correct
2. Verify you restarted the server after changing `.env.local`
3. Check browser console for detailed error messages

### Rate Limiting

**Gemini Free Tier Limits:**
- 15 requests per minute
- 1500 requests per day

If you hit these limits:
- Wait a minute and try again
- Consider upgrading to paid tier
- OR switch to Claude for unlimited requests (pay-as-you-go)

---

## 📝 Notes

- The app caches AI responses in session storage to avoid unnecessary API calls
- Switching providers clears the cache (different provider = new analysis)
- Both providers use the same Warren Buffett analysis prompt
- Token deduction happens the same way regardless of provider

---

## 🔐 Best Practices

1. **Keep both API keys** in `.env.local` for easy switching
2. **Use Gemini for development** to avoid costs
3. **Use Claude for production** for best quality
4. **Monitor usage** via provider dashboards
5. **Implement fallback logic** if you want automatic failover (advanced)

---

## 📚 Related Documentation

- [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md) - How to get API keys
- [SETUP_SUMMARY.md](./SETUP_SUMMARY.md) - Overview of all changes
- [src/lib/ai-config.ts](./src/lib/ai-config.ts) - AI configuration file
- [src/hooks/useBuffettAiReport.ts](./src/hooks/useBuffettAiReport.ts) - Hook that uses the config

---

**Need help?** Check the [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md) troubleshooting section or open an issue on GitHub.
