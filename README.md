# Push Notifications for NodeBB (via ntfy)

This plugin integrates NodeBB's notifications with [ntfy](https://ntfy.sh/), a simple HTTP-based [pub-sub](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) notification service.

## How to use it

### As an administrator

This plugin comes bundled with NodeBB as of v3.0.0.
Activate this plugin from ACP > Extend > Plugins, and then rebuild & restart your NodeBB.

### As an end user

1. [Download the ntfy app](https://docs.ntfy.sh/subscribe/phone/) (alternatively, [use the web interface](https://ntfy.sh/app)).
1. Get your personal notification id via your profile. Protect this link — otherwise someone else can intercept and view your notifications as well.
1. Paste the topic name into the ntfy app or web app.