using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SepaClientApp.Models;

namespace SepaClientApp.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            DataCatalogViewModel vm = new DataCatalogViewModel();
            vm.WebApiBaseUrl = ConfigurationManager.AppSettings["DataCatalogWebApiUrl"];
            return View(vm);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}