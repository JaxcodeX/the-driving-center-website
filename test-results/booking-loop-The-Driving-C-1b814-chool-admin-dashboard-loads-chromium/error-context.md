# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-loop.spec.ts >> The Driving Center — Critical Flows >> 1. Demo login → school admin dashboard loads
- Location: e2e/booking-loop.spec.ts:29:7

# Error details

```
Error: Channel closed
```

```
Error: page.goto: Target page, context or browser has been closed
```

```
Error: browserContext.close: Test ended.
Browser logs:

<launching> /Users/cayden/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --enable-automation --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --no-sandbox --user-data-dir=/Users/cayden/.openclaw/tmp/playwright_chromiumdev_profile-GIRKo0 --remote-debugging-pipe --no-startup-window
<launched> pid=16664
[pid=16664][err] [16664:442030:0514/092630.604854:ERROR:google_apis/gcm/engine/registration_request.cc:291] Registration response error message: DEPRECATED_ENDPOINT
[pid=16664][err] [16664:442030:0514/092654.791341:ERROR:google_apis/gcm/engine/registration_request.cc:291] Registration response error message: DEPRECATED_ENDPOINT
[pid=16664][err] [16664:442030:0514/092741.806996:ERROR:google_apis/gcm/engine/registration_request.cc:291] Registration response error message: DEPRECATED_ENDPOINT
[pid=16664][err] [16664:442030:0514/092940.946335:ERROR:google_apis/gcm/engine/registration_request.cc:291] Registration response error message: DEPRECATED_ENDPOINT
[pid=16664][err] [16664:442030:0514/093322.489098:ERROR:google_apis/gcm/engine/registration_request.cc:291] Registration response error message: DEPRECATED_ENDPOINT
[pid=16664][err] [16664:442030:0514/093855.066170:ERROR:google_apis/gcm/engine/registration_request.cc:291] Registration response error message: DEPRECATED_ENDPOINT
[pid=16664][err] [16664:442030:0514/224928.326048:ERROR:google_apis/gcm/engine/connection_factory_impl.cc:483] ConnectionHandler failed with net error: -2
[pid=16664] <gracefully close start>
```