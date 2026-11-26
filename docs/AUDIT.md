# Audit checkpoint — 26 November 2026

Public source: https://github.com/anshuman-pandey/margin-ferry

Reviewed source head: `113cba3eed559bc397213b0279793b88b27f8003`. Latest recorded [CI run](https://github.com/anshuman-pandey/margin-ferry/actions/runs/43703039744) is success at this head.

Fresh local core check:

```text
✔ reject unsafe sources and duplicate article IDs (2.059806ms)
✔ highlight offsets retain exact text including emoji and survive JSON roundtrip (3.643596ms)
✔ reject overlapping, stale quote, out-of-range and split-surrogate highlights (2.247188ms)
✔ Markdown escapes active HTML and markdown from titles, body and notes (0.947019ms)
✔ merge is idempotent, rejects conflicts and never changes inputs (0.663206ms)
✔ corrupt and oversized backups fail before storage (10.952238ms)
✔ stale-tab writes never overwrite a new revision (2.328629ms)
✔ quota and missing locks preserve prior data (0.297313ms)
✔ recovery requires unchanged corrupt bytes and a fully valid backup (0.875387ms)
ℹ tests 9
ℹ suites 0
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 168.386197
```

Releases: None returned by GitHub. No hosted demo URL was verified. A source archive or preview release is not a hosted deployment.

Remaining checks:

- Native-speaker review
- Manual selection comfort and touch interaction
- Public HTTPS deployment

This refresh corrects the publication checkpoint and preserves the earlier dated workflow results. It does not claim fresh browser, hardware or production security acceptance. Next: complete the listed acceptance checks and verify a persistent HTTPS deployment where required.
