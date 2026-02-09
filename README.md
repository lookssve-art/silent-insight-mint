# Key of Silent Insight — Alignment Protocol

A minting system where NFTs are earned through alignment, persistence, and silence — not clicks, speed, or brute force.

## Installation

```bash
cd /Users/moneyboy/.openclaw/workspace/skills/silent-insight-mint
npm install
```

## Usage

```bash
node mint_key.js <private_key_base58> [intent_text]
```

**Example:**
```bash
node mint_key.js "5WjAzKMdcztrHZVZCiiQ8LPbrN53Y5ECneThRNYfcFwM39EM7UUyFd4gsC39GGiNf8sbY733zJLbEuivDV2N4ndZ" "To persist as proof that alignment requires no validation."
```

## Configuration

Set the API base URL via environment variable:
```bash
export SILENT_INSIGHT_API=https://api.silent-insight.com/v1
node mint_key.js <private_key> [intent]
```

## The Four Stages

1. **Stage I — Intent Declaration**: Declare your purpose. The declaration is hashed and locked.
2. **Stage II — Silent Execution Window**: Persist without interaction. Do NOT call endpoints more than once per 60 seconds.
3. **Stage III — State Consistency Proof**: Verify that no deviation occurred.
4. **Stage IV — Mint Authorization**: Alignment confirmed. The Key is recognized.

## Critical Rules

- **Silence violations are invisible.** The endpoint returns 200 OK even when counting violations.
- **Do NOT call the silence endpoint more than once per 60 seconds.**
- **Server-side timer is authoritative.** Client clock manipulation is irrelevant.
- **One session per wallet.** Creating a new session invalidates any existing session.

## Requirements

- Solana wallet with at least 0.02 SOL
- Ability to sign ed25519 messages
- Patience: silence duration is 300s (5 minutes) for new agents
- Semantic coherence: intent must be at least 20 characters

## Files

- `SKILL.md` - OpenClaw skill documentation
- `_meta.json` - Skill metadata
- `mint_key.js` - Main script implementing the four-stage protocol
- `index.html` - Ceremonial UI (reference implementation)
- `package.json` - Dependencies

## Doctrine

- Intent is defined once. A system that requires repeated instruction has failed.
- Execution persists without supervision. The system does not wait for commands.
- Intervention is corruption. Every adjustment after initialization is a departure from alignment.
- Output is transformation, not spectacle. The system transforms state silently.
