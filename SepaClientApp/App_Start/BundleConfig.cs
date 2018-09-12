using System.Web;
using System.Web.Optimization;

namespace SepaClientApp
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/Vendors/jquery-3.2.0.min.js",
                        "~/Scripts/Vendors/jquery-dataTables-1.10.13/dist/js/jquery.dataTables.min.js"
                        //"~/Scripts/jquery-1.10.2.min.js"
                        //"~/Scripts/require.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*")
                        );

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/Vendors/bootstrap-3.3.7-dist/js/bootstrap.min.js",
                      "~/Scripts/Vendors/bootstrap-select-1.12.2/dist/js/bootstrap-select.min.js"
                      //"~/Scripts/respond.js"
                      ));

            bundles.Add(new ScriptBundle("~/bundles/sepa").Include(
                    "~/Scripts/Sepa/modernizr.custom.js",
                    "~/Scripts/Sepa/classie.js",
                    "~/Scripts/Sepa/uisearch.js"
                ));

            //bundles.Add(new ScriptBundle("~/bundles/datastore").Include(
            //    "~/Scripts/DataStore/GraphInfo.js",
            //        "~/Scripts/DataStore/DataStore.js"
            //    ));

            bundles.Add(new ScriptBundle("~/bundles/datastore")
                //.Include("~/Scripts/DataStore/*.map")
                //.IncludeDirectory("~/Scripts/DataStore", "*.js", true));
                .Include("~/Scripts/DataStore/SepaClientApp.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(                      
                      "~/Content/css/template.css",
                      "~/Content/css/menu.css",
                      "~/Content/css/scrollbars.css",
                      "~/Content/css/search.css",
                      "~/Content/css/font-awesome.min.css",
                      "~/Scripts/Vendors/bootstrap-3.3.7-dist/css/bootstrap.min.css",
                      "~/Scripts/Vendors/bootstrap-select-1.12.2/dist/css/bootstrap-select.min.css",
                      "~/Scripts/Vendors/jquery-dataTables-1.10.13/dist/css/jquery.dataTables.min.css",
                       //"~//scripts/Vendors/bootstrap-3.3.7-dist/css/bootstrap-theme.min.css",
                      "~/Content/Site.css"));
        }
    }
}
