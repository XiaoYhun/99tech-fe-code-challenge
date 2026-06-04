## Problem 3 - refactor notes

What I have fixed:

- Fixed filter (`lhsPriority` to `balancePriority`) - old name was a typo and never defined, so the filter did not work.
- Sort returns `0` when priorities match - otherwise the comparator can return `undefined` and order gets unpredictable.
- Rows should be map from `formattedBalances` - formatting was built but rows still read `sortedBalances`, so `formatted` part was missing.
- `getPriority` moved outside the component - stops recreating it every render.
- Add `Blockchain` enum, no `any` - chain names are typed instead of loose strings.
- Add `blockchain` to `WalletBalance` - code already used it but interface did not declare it.
- `FormattedWalletBalance` extends `WalletBalance` - less duplication, types stay aligned.
- Neo priority `10` (was `20`) - Zilliqa and Neo were the same; split so sort order is clear.
- Guard when `balances` is missing - return `[]` instead of crashing on `.filter`.
- Removed `prices` from sorted `useMemo` deps - not used in that step, so memo re-ran for nothing.
- Wrap `formattedBalances` with `useMemo` - only recomputes when `sortedBalances` changes.
- change `toFixed(0)` to `toFixed(2)` - 2 decimal better formatting for a currency balance
- Change Row `key` to `balance.currency` instead of `index`.
- Add nullish coalescing to `prices?.[currency] ?? 0`.
