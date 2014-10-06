## MVC Pagination Jquery Ajax For SEO ##

### Basic usage ###

Plugin requires jQuery (required - 1.7.0 or higher).

You can use Bootstrap CSS styler or Custom CSS.

The following code shows call the function on `<ul>` tag (it can be also `<div>` tag).

```C#
@using Pagination.Components
@{
    var modelPaginning = new Pagination.ModelPaginning();
    modelPaginning.Id = "mvc-pagination";
    modelPaginning.TotalPages = 50;
    modelPaginning.StartPage =  Convert.ToInt32(!String.IsNullOrEmpty(Request["page"]) ? Request["page"].ToString() : "1");
    modelPaginning.VisiblePages = 5;
    modelPaginning.First = "Primeiro";
    modelPaginning.Prev = "Anterior";
    modelPaginning.Next = "Próximo";
    modelPaginning.Last = "Último";
    modelPaginning.Href = "?page={{pagenumber}}";
    modelPaginning.ShowControl = true;
    modelPaginning.ShowPrevNext = true;
    modelPaginning.ShowFirstLast = true;
    modelPaginning.HrefVariable = "{{pagenumber}}";
}

@using (Html.MVCPagination(modelPaginning)){ }

```

```javascript
$('.mvc-pagination').mvcPagination({
	totalPages: @Html.Raw(modelPaginning.TotalPages),
	visiblePages: @Html.Raw(modelPaginning.VisiblePages),
	href: "@Html.Raw(modelPaginning.Href)",
	startPage: @Html.Raw(modelPaginning.StartPage),
	first: "@Html.Raw(modelPaginning.First)",
	prev: "@Html.Raw(modelPaginning.Prev)",
	next: "@Html.Raw(modelPaginning.Next)",
	last: "@Html.Raw(modelPaginning.Last)",
	showPrevNext: @Html.Raw(modelPaginning.ShowPrevNext.ToString().ToLower()),
	showFirstLast: @Html.Raw(modelPaginning.ShowFirstLast.ToString().ToLower()),
	showControl: @Html.Raw(modelPaginning.ShowControl.ToString().ToLower()),
	hrefVariable: "@Html.Raw(modelPaginning.HrefVariable)";
	onClick: function (event, page) {
		$('#page-content').text('Page ' + page);
	}
});

```

For more information see [docs on github pages](http://ikezili.github.io/mvc-pagination)
