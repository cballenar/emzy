
<form class="form-inline">
	<div class="handle"></div>
	<div class="btn-group pull-right">
		<a class="btn btn-small addChildNode"><i class="icon-arrow-right"></i></a>
		<a class="btn btn-small addSiblingNode"><i class="icon-arrow-down"></i></a>
		<a class="btn btn-small btn-danger removeNode"><i class="icon-remove icon-white"></i></a>
	</div> 
	<div class="formWrapper">
		<input type="text" class="nodeName" value="<%= name %>" disabled>
		<span> { </span>
		<input type="text" class="nodeInput" value="<%= px %>" />
		<span> = </span>
		<input type="text" class="nodeOutput" disabled />
		<span> }</span>
	</div>
</form>