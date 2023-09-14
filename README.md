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

## Using a service other than ntfy.sh

This is currently not supported. Please open an issue if you are interested in sponsoring this work.

## v2.x support

Basic functionality of this plugin is supported in NodeBB v2.x.
More advanced functionality is hidden away and only available for v3.x and up.

That would include (but is not limited to):

* Notify/Email on tagged topic