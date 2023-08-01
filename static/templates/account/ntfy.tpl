<!-- IMPORT partials/account/header.tpl -->

<h3 class="fw-semibold fs-5">[[ntfy:profile.label]]</h3>

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

<div class="row">
	<div class="col-sm-6">
		<label for="topic">Your private push notification "topic name" is:</label>
		<div class="input-group mb-3 mt-1">
			<input id="topic" type="text" class="form-control" value="{ntfyTopic}" readonly />
			<a class="btn btn-success" href="{ntfyUrl}">[[ntfy:profile.subscribe]]</a>
		</div>
		<!-- TODO: separate server url if specified in ACP -->
		<p class="form-text">
			<em>Treat this topic name like a password!</em>
		</p>
		<p class="form-text">
			If the topic name is leaked, it can be used by others to receive your notifications.
		</p>

		<button class="btn btn-outline-primary" data-action="test">[[ntfy:profile.test]]</button>
		<button class="btn btn-outline-danger" data-action="regenerate">[[ntfy:profile.regenerate]]</button>
	</div>
</div>

<!-- IMPORT partials/account/footer.tpl -->