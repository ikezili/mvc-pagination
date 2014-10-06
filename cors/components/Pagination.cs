using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MVCPagination.Components
{
    public static class Pagination
    {
        private class PageModel
        {
            public Int32 CurrentPage { get; set; }
            public List<Int32> Pages { get; set; }
        }

        public class ModelPaginning
        {
            public Int32 TotalPages { get; set; }
            public Int32 VisiblePages { get; set; }
            public Int32 StartPage { get; set; }
            public String Href { get; set; }
            public String HrefVariable { get; set; } 
            public String First { get; set; }
            public String Prev { get; set; }
            public String Next { get; set; }
            public String Last { get; set; }
            public String PaginationClass { get; set; }
            public String PageClass { get; set; }
            public String FirstClass { get; set; }
            public String PrevClass { get; set; }
            public String NextClass { get; set; }
            public String LastClass { get; set; }
            public String ActiveClass { get; set; }
            public String DisabledClass { get; set; }
            public String Id { get; set; }
            public Boolean ShowControl { get; set; }
            public Boolean ShowPrevNext { get; set; }
            public Boolean ShowFirstLast { get; set; }
            public ModelPaginning()
            {
                StartPage = 1;
                VisiblePages = 5;
                TotalPages = 0;
                First = "First";
                Prev = "Prev";
                Next = "Next";
                Last = "Last";
                Href = "javascript:void(0)";
                HrefVariable = "{{number}}";
                PaginationClass = "pagination";
                PageClass = "page";
                FirstClass = "first";
                PrevClass = "prev";
                NextClass = "next";
                LastClass = "last";
                ActiveClass = "active";
                DisabledClass = "disabled";
                Id = "mvc-pagination";
                ShowControl = true;
                ShowPrevNext = true;
                ShowFirstLast = true;
            }
        }

        private static ModelPaginning PaginningOption;

        public static HtmlPanelComponent MVCPagination(this HtmlHelper html, ModelPaginning options)
        {
            PaginningOption = options;

            String retorno = "";

            if(options.StartPage < 1 || options.StartPage > options.TotalPages)
            {
                throw new Exception("Start page option is incorrect!");
            }

            if(options.TotalPages <= 0)
            {
                throw new Exception("Total pages option is incorrect!");
            }

            if (options.VisiblePages <= 0)
            {
                throw new Exception("Visible pages option is incorrect!");
            }

            if(options.TotalPages < options.VisiblePages)
            {
                options.VisiblePages = options.TotalPages;
            }

            var pagesGenerated = GetPages(options.StartPage);

            retorno = "<ul id=\"" + options.Id + "\" class=\"mvc-pagination " + options.PaginationClass + "\">";

            if (options.ShowControl)
            {
                if (options.ShowFirstLast)
                {
                    retorno += "<li class=\"" + options.FirstClass + " " + (options.StartPage == 1 ? options.DisabledClass : "") + "\"><a href=\"" + (options.Href.Contains(options.HrefVariable) ? options.Href.Replace(options.HrefVariable, "1") : options.Href) + "\">" + options.First + "</a></li>";
                }

                if (options.ShowPrevNext)
                {
                    retorno += "<li class=\"" + options.PrevClass + " " + (options.StartPage == 1 ? options.DisabledClass : "") + "\"><a href=\"" + (options.Href.Contains(options.HrefVariable) ? options.Href.Replace(options.HrefVariable, (options.StartPage - 1).ToString()) : options.Href) + "\">" + options.Prev + "</a></li>";
                }
            }
            foreach(Int32 page in pagesGenerated.Pages)
            {
                retorno += "<li class=\"" + options.PageClass + " " + (options.StartPage == page ? options.ActiveClass : "") + "\"><a href=\"" + (options.Href.Contains(options.HrefVariable) ? options.Href.Replace(options.HrefVariable, page.ToString()) : options.Href) + "\">" + page + "</a></li>";
            }

            if (options.ShowControl)
            {

                if (options.ShowPrevNext)
                {
                    retorno += "<li class=\"" + options.NextClass + " " + (options.StartPage == options.TotalPages ? options.DisabledClass : "") + "\"><a href=\"" + (options.Href.Contains(options.HrefVariable) ? options.Href.Replace(options.HrefVariable, (options.StartPage + 1).ToString()) : options.Href) + "\">" + options.Next + "</a></li>";
                }

                if (options.ShowFirstLast)
                {
                    retorno += "<li class=\"" + options.LastClass + " " + (options.StartPage == options.TotalPages ? options.DisabledClass : "") + "\"><a href=\"" + (options.Href.Contains(options.HrefVariable) ? options.Href.Replace(options.HrefVariable, options.TotalPages.ToString()) : options.Href) + "\">" + options.Last + "</a></li>";
                }
            }
            retorno += "</ul>";

            html.ViewContext.Writer.Write(retorno);

            return new HtmlPanelComponent(html.ViewContext);
        }

        public class HtmlPanelComponent : IDisposable
        {
            private readonly ViewContext _viewContext;
            public HtmlPanelComponent(ViewContext viewContext)
            {
                _viewContext = viewContext;
            }
            public void Dispose()
            {
                
            }
        }

        private static PageModel GetPages(Int32 CurrentPage)
        {
            List<Int32> pages = new List<Int32>();

            Int32 half = Convert.ToInt32(Math.Floor(Convert.ToDecimal(PaginningOption.VisiblePages) / 2));
            Int32 start = CurrentPage - half + 1 - PaginningOption.VisiblePages % 2;
            Int32 end = CurrentPage + half;

            if (start < 0)
            {
                start = 1;
                end = PaginningOption.VisiblePages;
            }

            if(end > PaginningOption.TotalPages)
            {
                start = PaginningOption.TotalPages - PaginningOption.VisiblePages + 1;
                end = PaginningOption.TotalPages;
            }

            for (Int32 itPage = start; itPage <= end;itPage++ )
            {
                pages.Add(itPage);
            }

            return new PageModel() { CurrentPage = CurrentPage, Pages = pages };
        }
    }
}
