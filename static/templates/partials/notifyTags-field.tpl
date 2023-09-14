<div class="mb-3 association">
	<div class="input-group">
		<input type="text" name="notifyTags" class="form-control" placeholder="Tag" value="{./tag}" {{{ if ./tag }}}disabled{{{ end }}}>
		<span class="input-group-text">&rarr;</span>
		<input type="text" name="notifyChannels" class="form-control" placeholder="Channel" value="{./channel}" {{{ if ./channel }}}disabled{{{ end }}}>
		<button class="btn" type="button" data-action="remove"><i class="fa fa-trash text-danger"></i></button>
	</div>
</div>