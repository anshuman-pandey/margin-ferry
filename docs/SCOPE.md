# Scope and launch preparation

Queue item: OpenRead / Readwise Reader. Working product name: Margin Ferry.

The useful loop is **save readable text → select an exact quote → add a thought → export portable notes**. The first version takes pasted article text, keeping ingestion explicit and avoiding claims about web extraction, paywalls, PDFs or automatic sync. It has no AI features, accounts, network fetches or telemetry.

Research checked 15 November 2026:
- Readwise's primary documentation: https://docs.readwise.io/reader/docs/faqs/exporting — document annotations can be exported as Markdown, and the broader product has integrations. This defines the relevant comparison, not evidence of demand for our product.
- GitHub repository-name search `margin-ferry in:name` returned zero matches. A quoted web search found no exact software match. Neither is trademark clearance. “Leaf Thread” was considered and discarded because results overlapped with other Leaf software/reading products.

## Concrete distribution path after approval

The launch material is the actual reading screenshot and a reproducible sample article. The useful demonstration is a short original reading passage, an exact highlight, a personal note and the resulting `.md` file. It can be manually moved into a local Markdown notes folder. No note-app plugin, external listing, community endorsement or accepted integration PR is claimed. A distribution PR would first require a relevant target and a review of its current contribution rules. No external submissions have been made.

README and repository description should name **Readwise Reader**, the implemented pasted-text/highlighting/notes/Markdown workflow and MIT licensing. Avoid advertising a general Reader replacement. The static package can be demonstrated from localhost now; a public demo requires separate deployment approval.

## Owner acceptance

The automated browser check covers desktop text selection via the browser Selection/Range API and actual UI events. Before a broad launch, check comfortable mouse and keyboard selection on the owner's browser, native-speaker wording, and touch selection if mobile use will be advertised. Public HTTPS deployment and native Obsidian/other note-app imports have not been exercised. Core export tests validate the Markdown text rather than claiming an external integration.

Publication requires a product-specific go-ahead. No public repository, push, release or deployment is authorized by this local preparation.
