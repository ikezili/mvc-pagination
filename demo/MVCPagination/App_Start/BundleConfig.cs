using System.Web;
using System.Web.Optimization;

namespace MVCPagination
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include("~/Scripts/jquery/jquery-2.0.3.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jquery-mvcPagination").Include("~/Scripts/jquery.mvcPagination/jquery.mvcPagination.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/bootstrap/3.0.3/css/bootstrap.min.css"));

            BundleTable.EnableOptimizations = true;
        }
    }
}
