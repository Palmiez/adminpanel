using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using SepaClientApp.Models;
using SepaClientApp.Services;

namespace SepaClientApp.Controllers
{
    public class UpdateNotifyController : AsyncController
    {
        public void IndexAsync()
        {
            var vm = new DataCatalogViewModel
            {
                WebApiBaseUrl = ConfigurationManager.AppSettings["DataCatalogWebApiUrl"]
            };

            AsyncManager.OutstandingOperations.Increment();

            Task.Factory.StartNew(() =>
            {

                DataCatalogViewModel result = DataStoreSrv.RunAsync(vm, "/GetGraphInfos").Result;

                AsyncManager.Parameters["vm"] = result;
                AsyncManager.OutstandingOperations.Decrement();
            });            
        }

        public ActionResult IndexCompleted(DataCatalogViewModel vm)
        {
            vm.WebApiBaseUrl = ConfigurationManager.AppSettings["DataCatalogWebApiUrl"];
            var licenseList = new List<LookupField>
            {
                new LookupField(displayValue: "OGL",id: "ogl"),
                new LookupField(displayValue: "Creative Commons",id: "creativeCommons"),
                new LookupField(displayValue: "Other",id: "other")
            };


            var model = new UpdateNotifyViewModel
            {
                LicenseList = licenseList,
                CatalogList = new List<LookupField>
                {
                    new LookupField {Id = "seweb", DisplayValue = "Scotland Environment Web"}
                },
                DatasetList = new List<LookupField>()
            };

            model.DatasetList = vm.DataSets.Select(x => new LookupField(x.GraphId, x.Title));

            return View(model);
        }

        public void DistributionsAsync(string id)
        {

            var vm = new List<DistributionViewModel>();     
                  
            var webApiBaseUrl = ConfigurationManager.AppSettings["DataCatalogWebApiUrl"];
            AsyncManager.OutstandingOperations.Increment();

            Task.Factory.StartNew(() =>
            {

                var result = DataStoreSrv.RunAsync(vm, $"{webApiBaseUrl}/GetDistributions/{id}").Result;

                AsyncManager.Parameters["vm"] = result;
                AsyncManager.Parameters["id"] = id;
                AsyncManager.OutstandingOperations.Decrement();
            });
        }

        public ActionResult DistributionsCompleted(string id, IEnumerable<DistributionViewModel> vm)
        {
            return Json(vm, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Index(string id, FormCollection collection)
        {
            var list = new Dictionary<string, string>();
            foreach (string key in collection.Keys)
            {
                list.Add(key, collection[key]);
            }
            using (var client = new HttpClient())
            {
                var webApiBaseUrl = ConfigurationManager.AppSettings["DataCatalogWebApiUrl"];
                client.BaseAddress = new Uri(webApiBaseUrl);
                var graphId = collection["DatasetList"];
                id = graphId.Substring(graphId.LastIndexOf('/') + 1);
                var json = JsonConvert.SerializeObject(list);
                //var jsonObj = Json(collection);
                //var content = collection.AllKeys.ToDictionary(k => k, v => collection[v]);
                var url = $"/UpdateNotification/{id}";
                
                var result = client.PostAsJsonAsync(webApiBaseUrl + url, json).Result;
                if (result.IsSuccessStatusCode)
                {
                    return View("NotificatySuccess");
                }
                else
                {
                    return View("NotifyFail");
                    string contentResult = result.Content.ReadAsStringAsync().Result;
                    return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, contentResult);
                }
            }
                
        }

        //// GET: UpdateNotify
        //[HttpGet]
        //public ActionResult Index()
        //{
        //    UpdateNotifyViewModel vm = new UpdateNotifyViewModel();
        //    vm.CatalogList = new List<LookupField>
        //    {
        //        new LookupField { Id = "seweb", DisplayValue = "Scotland Environment Web"}
        //    };
        //    vm.DatasetList = new List<LookupField>();

        //    return View(vm);
        //}

        //[HttpPost]
        //public ViewResult Index(UpdateNotifyViewModel vm)
        //{
        //  //  TryValidateModel(vm);

        //    if (ModelState.IsValid)
        //    {

        //    }

        //    return View(vm);
        //}
    }
}