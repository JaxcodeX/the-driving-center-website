# WORKFLOW LOG — The Driving Center SaaS

## Entry 1 — 2026-04-24, Morning

### Topic
Workflow setup + FSO research + coding agent configuration

### Research Done
- **Alex Finn workflow:** OpenClaw + Claude Code + Vercel + Supabase. SPEC.md → Claude Code writes code → test → push → Vercel deploys. Same pattern we're adopting.
- **Model comparison:** MiniMax M2.7 scores 80.2% on SWE-bench Verified — equivalent to Claude Opus 4.6 at 1/20th the cost. Already configured.
- **Gemini CLI:** Free, no API key needed. Top-tier 2026 coding agent. Can be primary coding agent alongside OpenClaw.
- **Codex:** Installed but not authenticated — needs OpenAI API key or ChatGPT Plus trial.

### Decision Made
- Stop model swapping — stack is already optimal
- Use existing OpenClaw + MiniMax as conductor
- Zax: "I'm wasting time by trying to model swap"
- Zax confirmed: "You got this project I figured like it the FSO email correct"

### Current WORK ORDER (SPEC_DEMO_FIX.md)
Fix school→auth link — the #1 blocker for demo flow:
1. Add `owner_id` to `schools` table
2. Update auth callback to link user→school
3. Create `/api/auth/me` helper
4. Update complete-profile to read school_id
5. Update middleware

### Stack Status
- OpenClaw + MiniMax ✅ (conductor)
- Vercel auto-deploy ✅
- GitHub connected ✅  
- STRIPE_STARTER_PRICE_ID ❌ (Zax adding manually)
- Coding agent: TBD (Gemini CLI free tier as primary)

### Zax's Rule (non-negotiable)
"You are never allowed to proceed if something's broken I don't know about. Uneven knowledge = uneven building."
→ Every message to Zax must list all known broken things before proposing next steps
→ Never proceed without Zax knowing the full state
