Rolling 90-Day Rating

Display
- Primary rating shows a rolling 90-day snapshot of verified reviews.
- Lifetime badges exist separately (tenure, reliability) and do not affect 90-day score.

Inputs
- Verified order reviews in last 90 days (hidden=false).
- Fulfilment and on-time metrics sourced from orders/deliveries.

Example Score Model
- rating = 0.6 × Quality(avg 1–5) + 0.2 × Fulfilment(completed/accepted) + 0.2 × OnTime%

Implementation
- On-demand endpoint: `GET /merchant/{id}/rating?window=90d` reads `reviews` and `orders` within window.
- Nightly job (cron or worker) pre-aggregates into a table: `merchant_rating_snapshots` with windowed fields.

Schema Additions (optional)
- `merchant_rating_snapshots(merchant_id, window_days, quality_avg, fulfilment_ratio, ontime_ratio, computed_at)`

Edge Cases
- Low volume merchants: display “Not enough data” until N≥X reviews.
- Anti-abuse: one review per order; moderation can hide outliers; anomaly detection flagged to admin.

