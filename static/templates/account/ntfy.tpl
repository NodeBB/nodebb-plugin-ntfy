<div class="account">
	<!-- IMPORT partials/account/header.tpl -->

	<div class="card w-50 mx-auto">
		<div class="card-body">
			<p class="fw-semibold">Your private push notification "topic name" is:</p>
			<div class="mb-3">
				<input id="topic" type="text" class="form-control" value="{ntfyTopic}" readonly />
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