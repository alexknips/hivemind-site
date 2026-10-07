// Slide 4's numbers: our own project's decision record (the hivemind repository's local ledger,
// /data/projects/hivemind/hivemind/ledger.sqlite), counted on a copy on 7 Oct 2026 with hivemind
// 0.7.0. Who decided is the decider when one is recorded, else the proposer: human:* is a person,
// every other actor (agent:*) an agent. The sources note on slide 4 gives the commands.
export const decisionRecord = {
  date: '7 Oct 2026',
  decisions: 32,
  byPerson: 22,
  byAgent: 10,
  agentReviewedByPerson: 0,
  contested: 0,
  superseded: 0,
};

export const notes = [
  {
    "title": "Threaded project memory",
    "timing": "0–11 seconds",
    "paragraphs": [
      "I’m Jeff. My co-founder Alex and I are building Loomtracer: threaded project memory for you, your team, and your AI agents."
    ]
  },
  {
    "title": "The problem",
    "timing": "11–23 seconds",
    "paragraphs": [
      "Across chats and accounts, findings are buried over time. Decisions separate from reasoning. It’s up to you to connect lost threads."
    ]
  },
  {
    "title": "Trace decisions and reasoning from start to finish",
    "timing": "23–37 seconds",
    "paragraphs": [
      "Agents explore different options through MCP and record what they find. Loomtracer threads those outcomes into the next decision. You and your team approve the direction."
    ],
    "sources": ["Conceptual decision flow based on Jeff’s uploaded demo graph.png. Agents contribute findings; humans ratify decisions. Dividing work is a workflow stage, not a claim that Loomtracer automatically assigns or orchestrates agents. The outcome labels are illustrative, not measured product performance."]
  },
  {
    "title": "Decisions by a person or an agent",
    "timing": "37–47 seconds",
    "paragraphs": [
      "Our own record: 32 decisions. 22 by a person, 10 by an agent, so you know what to review."
    ],
    "sources": [
      "Our own project’s decision record: the local ledger of the hivemind repository (/data/projects/hivemind/hivemind/ledger.sqlite), read from a copy on 7 Oct 2026 with hivemind 0.7.0. Its 32 decisions were recorded between 25 May and 11 Sep 2026. Not a benchmark.",
      "Commands, on the copy: hivemind --hivemind-dir <copy> query recent_decisions --since 2000-01-01 --limit 500 (32 decisions: 31 proposed, 1 accepted); query get_decision_neighborhood --id <each decision> for who decided; query get_contested_decisions (none). The ledger holds no rejection and no supersession, so none was disagreed with or replaced.",
      "Who decided: the decider when one is recorded, else the person or agent who recorded the decision. Actors starting human: count as a person (22), all others, agent:claude, agent:codex and agent:paperclip, as an agent (10). Of the 10 agent decisions, 9 are unreviewed and 1 was accepted by the same agent: none was reviewed by a person.",
      "Speed, consistency and flexibility measures are not built yet; the slide shows them as coming. The slide does not claim that decisions get better."
    ]
  },
  {
    "title": "Self-Hosted or Hosted (coming soon)",
    "timing": "47–57 seconds",
    "paragraphs": [
      "Here’s the self-hosted version inside Claude Code, alongside the decision graph. Hosted access is coming soon."
    ],
    "sources": [
      "Self-hosted: Alex Knips’s original capture.png from the pitch before the Loomtracer name, unchanged. Source: https://github.com/alexknips/hivemind-site/blob/main/website/public/pitch/img/capture.png . Alex’s deck attributes this to a real Claude Code session in the pantry demo app, captured 24 September 2026 against hivemind main 881412f (0.6.0+881412f), per pitch-screens/README.md. The original deck says the demonstrated behavior is available in v0.7.0. This is original-source evidence, not a newly reproduced run.",
      "Decision graph: Loomtracer /demo with fictional pricing-study data, captured from the local branded UI. It does not show private workspace data. Hosted access is presented as coming soon per this pitch’s requested availability wording.",
      "Self-hosted and hosted are separate implementations. The pitch does not assert feature parity or automatic synchronization."
    ]
  },
  {
    "title": "Thank You",
    "timing": "57–68 seconds",
    "paragraphs": [
      "Thank you. Want to try it yourself? We want to talk to you about where Loomtracer could fit into your workflow."
    ],
    "sources": [
      "www.loomtracer.ai is a user-supplied placeholder. It is displayed as plain text, not a verified live link. Replace or confirm it before public delivery."
    ]
  }
];
