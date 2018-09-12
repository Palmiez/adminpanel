using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using SepaClientApp.Models;
using SepaClientApp.Services;

namespace SepaClientApp.Controllers
{
    public class DatasetWelcomeController : AsyncController
    {
        static HttpClient _client = new HttpClient();
        // GET: DatasetWelcome
        public void IndexAsync()
        {
            var vm = new DataCatalogStatisticsViewModel
            {
                WebApiBaseUrl = ConfigurationManager.AppSettings["DataCatalogWebApiUrl"]
            };

            AsyncManager.OutstandingOperations.Increment();

            Task.Factory.StartNew(() =>
            {

                DataCatalogStatisticsViewModel result = DataStoreSrv.RunAsync(vm, "/GetDataCatalogStatistics").Result;

                AsyncManager.Parameters["vm"] = result;
                AsyncManager.OutstandingOperations.Decrement();
            });
        }

        public ActionResult IndexCompleted(DataCatalogStatisticsViewModel vm)
        {

            return View(vm);
        }


    }
}