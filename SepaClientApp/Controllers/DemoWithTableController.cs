using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;
using SepaClientApp.Models;
using SepaClientApp.Services;

namespace SepaClientApp.Controllers
{
    public class DemoWithTableController : AsyncController
    {
        
        // GET: DemoWithTable
        public void IndexAsync()
        {
            var vm = new DataCatalogViewModel
            {
                WebApiBaseUrl = ConfigurationManager.AppSettings["DataCatalogWebApiUrl"]
            };

            AsyncManager.OutstandingOperations.Increment(3);
            
            Task.Factory.StartNew(() =>
            { 
             
                DataCatalogViewModel result = DataStoreSrv.RunAsync(vm, "/GetGraphInfos").Result;

                AsyncManager.Parameters["vm"] = result;
                AsyncManager.OutstandingOperations.Decrement();
            });

            Task.Factory.StartNew(() =>
            {

                DataCatalogViewModel result = DataStoreSrv.GetPublishersAsync(vm, "/GetOrganisations").Result;

                AsyncManager.Parameters["publishers"] = result.Publishers;
                AsyncManager.OutstandingOperations.Decrement();
            });

            Task.Factory.StartNew(() =>
            {
                DataCatalogViewModel result = DataStoreSrv.GetOrganisationsAsync(vm, "/GetOrganisations").Result;

                AsyncManager.Parameters["organisations"] = result.Organisations;
                AsyncManager.OutstandingOperations.Decrement();
            });
        }

        public ActionResult IndexCompleted(DataCatalogViewModel vm, IEnumerable<DataPublisher> publishers, IEnumerable<Organisation> organisations  )
        {
            vm.WebApiBaseUrl = ConfigurationManager.AppSettings["DataCatalogWebApiUrl"];

            var dataPublishers = publishers as DataPublisher[] ?? publishers.ToArray();
            var publisherList = dataPublishers.ToList();
            vm.Publishers = publisherList;
            
            //var publisherDict = publisherList.ToDictionary(publisher => publisher.Uri, publisher => publisher.Name);
            var publisherDict = organisations.ToDictionary(org => org.Uri, org => org.ShortName);
            var organisationDict = new Dictionary<string,Organisation>();
            if (organisations != null)
            {
                foreach (var org in organisations)
                {
                    //var publisher = dataPublishers.FirstOrDefault(x => x.Name == org.ShortName);
                    //if (publisher == default(DataPublisher)) continue;

                    //org.Uri = publisher.Uri;
                    var datasets = vm.DataSets.Where(x => x.Publisher == org.Uri);
                    var graphInfoModels = datasets as GraphInfoModel[] ?? datasets.ToArray();
                    if (!graphInfoModels.Any()) continue;
                    org.DatasetCount = graphInfoModels.Count();
                    organisationDict.Add(org.Uri, org);
                }
            }
            vm.Organisations = organisationDict.Select(x => x.Value).ToList();

            var licenseList = new List<DistributionLicense>
            {
                new DistributionLicense("OGL","ogl"),
                new DistributionLicense("Creative Commons","creativeCommons"),
                new DistributionLicense("Other","other")
            };
            vm.Licenses = licenseList;

            var applicationList = new List<SupportedApplication>
            {
                new SupportedApplication("Interactive Map Tool","interactiveMapTool"),
                new SupportedApplication("Land Information Search - AE&F","landInformationSearchAEF"),
                new SupportedApplication("Land Information Search - COMAH","landInformationSearchCOMAH"),
                new SupportedApplication("Data Analysis Tool","dataAnalysisTool"),
                new SupportedApplication("Other","other")
            };

            vm.Applications = applicationList;

            foreach (var item in vm.DataSets)
            {
                if (publisherDict.ContainsKey(item.Publisher))
                {                    
                    item.Publisher = publisherDict[item.Publisher];
                    vm.Organisations.First(x => x.ShortName == item.Publisher).DatasetCount++;
                }               
            }
            return View(vm);
        }


        public void DatasetAsync(string id)
        {
            var vm = new DataSetViewModel();
            var webApiBaseUrl = ConfigurationManager.AppSettings["DataCatalogWebApiUrl"];
            var url = webApiBaseUrl + $"/GetDataset?graphId={id}";
            AsyncManager.OutstandingOperations.Increment();

            Task.Factory.StartNew(() =>
            {
                DataSetViewModel result = DataStoreSrv.RunAsync(vm, url).Result;
                result.Id = id;
                AsyncManager.Parameters["dataset"] = result;
                AsyncManager.OutstandingOperations.Decrement();
            });
        }

        public ActionResult DatasetCompleted(DataSetViewModel dataset)
        {
            if (string.IsNullOrEmpty(dataset.Publisher.Name))
            {
                dataset.Publisher.Name =
                dataset.Publisher.Uri.Substring(dataset.Publisher.Uri.LastIndexOf('/') + 1).ToUpperInvariant();
            }

            foreach (var dist in dataset.Distributions)
            {
                if (dist.Name == "WMS")
                {
                    if (!dist.AccessUrl.Contains('?'))
                    {
                        dist.AccessUrl += "?service=WMS&version=1.3.0&request=GetCapabilities";
                    }
                }
            }
            
            return View(dataset);
        }

        public void DistributionAsync(string graphId, string distId)
        {
                var vm = new DistributionViewModel();
            var webApiBaseUrl = ConfigurationManager.AppSettings["DataCatalogWebApiUrl"];
            var url = webApiBaseUrl + $"/GetDistribution?graphId={graphId}&distributionId={distId}";
            AsyncManager.OutstandingOperations.Increment();

            Task.Factory.StartNew(() =>
                {
                    DistributionViewModel result = DataStoreSrv.RunAsync(vm, url).Result;
                    AsyncManager.Parameters["distribution"] = result;
                    AsyncManager.OutstandingOperations.Decrement();
                }
            );
        }

        public ActionResult DistributionCompleted(DistributionViewModel distribution)
        {
            if (string.IsNullOrEmpty(distribution.Title))
            {
                distribution.Title = "No Title!";
            }
            return View(distribution);
        }
        
    }
}