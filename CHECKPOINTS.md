# Checkpoints

Restore points for the reel pipeline. To go back, check out the commit (or the local tag of the same name).

| Name | Commit | What it is |
|---|---|---|
| checkpoint-1 | `eee9d16` | Strategy 8 (hook, tracker, pinned CTA) + Strategy 9 (camera moves), Days 41-50. Retention at this point: ~50% left by 4-5 s, then flat ~40% → 30%; ~1.4k views a reel, 99.9% non-followers. |

Restore:

```bash
git checkout eee9d16 -- tools/reel-kit
```
