<div class="account">
	<!-- IMPORT partials/account/header.tpl -->

	<div class="row">
		<div class="panel panel-default col-xs-12 col-lg-offset-2 col-lg-8" style="margin-top: 1rem;">
			<div class="panel-body">
				<p>
					<a href="https://play.google.com/store/apps/details?id=io.heckel.ntfy">
						<img src="https://docs.ntfy.sh/static/img/badge-googleplay.png">
					</a>
					<a href="https://f-droid.org/en/packages/io.heckel.ntfy/">
						<img src="https://docs.ntfy.sh/static/img/badge-fdroid.png">
					</a>
					<a href="https://apps.apple.com/us/app/ntfy/id1625396347">
						<img src="https://docs.ntfy.sh/static/img/badge-appstore.png">
					</a>
				</p>
				<p>
					A mobile device is not necessary, <a href="https://docs.ntfy.sh/subscribe/web/">you can also subscribe to push notifications via your browser.</a>
				</p>

				<hr />

				<p><strong>Your private push notification "topic name" is:</strong></p>
				<div class="input-group" style="margin-bottom: 1rem;">
					<input id="topic" type="text" class="form-control" value="{ntfyTopic}" readonly />
					<span class="input-group-btn">
						<a class="btn btn-success" href="{ntfyUrl}">[[ntfy:profile.subscribe]]</a>
					</span>
				</div>
				<!-- TODO: separate server url if specified in ACP -->
				<p>
					<em>Treat this topic name like a password!</em>
				</p>
				<p>
					If the topic name is leaked, it can be used by others to receive your notifications.
				</p>
				<button class="btn btn-primary" data-action="test">[[ntfy:profile.test]]</button>
				<button class="btn btn-danger" data-action="regenerate">[[ntfy:profile.regenerate]]</button>
			</div>
		</div>
	</div>