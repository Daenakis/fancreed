# Deep Linking

> ⚠️ **Placeholder.** The recommended approach will be documented here once the
> production domain and link strategy are decided. The list below is only an
> outline of what this doc will cover — no implementation guidance yet.

## Current state

- A custom URL scheme is configured via `scheme` in `app.config.ts` (resolved
  per environment from `SCHEMES` in `env.ts`).
- Expo Router resolves deep links from the file-based routes in `src/app/`
  automatically — no extra config is needed for `<scheme>://` links.
- `expo-linking` is installed but not yet wired to any custom handling.

## To be documented (TODO)

- [ ] Testing custom-scheme links (`<scheme>://path`) on iOS and Android
- [ ] Universal Links (iOS): `associatedDomains` in `app.config.ts` + an
      `apple-app-site-association` file served from the domain
- [ ] App Links (Android): verified `intentFilters` + an `assetlinks.json`
      file served from the domain
- [ ] Parsing path and query params (`useLocalSearchParams`, `expo-linking`)
- [ ] Cold start vs. warm start handling (`Linking.getInitialURL` / `useURL`)
- [ ] Auth-gated deep links (redirect through sign-in, then resume the target)

## Docs

- [Expo Linking overview](https://docs.expo.dev/linking/overview/)
- [Expo Router — deep linking](https://docs.expo.dev/router/advanced/deep-linking/)
