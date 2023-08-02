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
				<p>[[ntfy:profile.no-mobile-needed]]</p>

				<hr />

				<p><strong>[[ntfy:profile.profile.topic-name]]</strong></p>
				<div class="input-group" style="margin-bottom: 1rem;">
					<input id="topic" type="text" class="form-control" value="{ntfyTopic}" readonly />
					<span class="input-group-btn">
						<a class="btn btn-success" href="{ntfyUrl}">[[ntfy:profile.subscribe]]</a>
					</span>
				</div>
				<!-- TODO: separate server url if specified in ACP -->
				<p class="form-text">
					<em>[[ntfy:profile.topic-secrecy]]</em>
				</p>
				<p class="form-text">[[ntfy:profile.topic-leakage]]</p>

				<button class="btn btn-primary" data-action="test">[[ntfy:profile.test]]</button>
				<button class="btn btn-danger" data-action="regenerate">[[ntfy:profile.regenerate]]</button>
			</div>
		</div>
	</div>