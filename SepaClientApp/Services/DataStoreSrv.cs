using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using SepaClientApp.Models;

namespace SepaClientApp.Services
{
    public class DataStoreSrv
    {
        static HttpClient _client = new HttpClient();

        public DataStoreSrv()
        {
            var webApiBaseUrl = ConfigurationManager.AppSettings["DataCatalogWebApiUrl"];
            _client.BaseAddress = new Uri(webApiBaseUrl);
            _client.DefaultRequestHeaders.Accept.Clear();
            _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }


        public static async Task<DataCatalogViewModel> RunAsync(DataCatalogViewModel vm, string uri)
        {
            try
            {
                try
                {
                    var datasets = await GetGraphInfosAsync(vm.WebApiBaseUrl + uri);
                    vm.DataSets = datasets;

                }
                catch (Exception ex)
                {
                    throw ex;
                }

                return vm;
            }
            catch (Exception ex)
            {
                _client.CancelPendingRequests();
                throw new Exception("RunAsync caused an error: " + ex.Message, ex);
            }
        }

        public static async Task<DistributionViewModel> RunAsync(DistributionViewModel vm, string url)
        {
            try
            {
                var distribution = await GetDistributionAsync(url);
                return distribution;
            }
            catch (Exception ex)
            {
                _client.CancelPendingRequests();
                throw new Exception("RunAsync caused an error: " + ex.Message, ex);
            }
        }

        

        public static async Task<DataCatalogViewModel> GetPublishersAsync(DataCatalogViewModel vm, string uri)
        {
            try
            {
                try
                {
                    if (uri.StartsWith("api"))
                    {
                        var url = vm.WebApiBaseUrl.Replace("api/DataCatalog", uri);
                        var publishers = await GetPublishersAsync(url);
                        vm.Publishers = publishers;
                    }
                    else
                    {
                        var publishers = await GetPublishersAsync(vm.WebApiBaseUrl + uri);
                        vm.Publishers = publishers;
                    }
                    

                }
                catch (Exception ex)
                {
                    throw ex;
                }

                return vm;
            }
            catch (Exception ex)
            {
                _client.CancelPendingRequests();
                throw new Exception("RunAsync caused an error: " + ex.Message, ex);
            }
        }

        public static async Task<DataCatalogViewModel> GetOrganisationsAsync(DataCatalogViewModel vm, string uri)
        {
            try
            {
                try
                {
                    var organisations = await GetOrganisationsAsync(vm.WebApiBaseUrl + uri);
                    vm.Organisations = organisations;

                }
                catch (Exception ex)
                {
                    throw ex;
                }

                return vm;
            }
            catch (Exception ex)
            {
                _client.CancelPendingRequests();
                throw new Exception("RunAsync caused an error: " + ex.Message, ex);
            }
        }

        public static async Task<DataCatalogStatisticsViewModel> RunAsync(DataCatalogStatisticsViewModel vm, string uri)
        {
            try
            {
                try
                {
                    var datasets = await GetDataCatalogStatisticsAsync(vm.WebApiBaseUrl + uri);
                    vm = datasets;

                }
                catch (Exception ex)
                {
                    throw ex;
                }

                return vm;
            }
            catch (Exception ex)
            {
                _client.CancelPendingRequests();
                throw new Exception("RunAsync caused an error: " + ex.Message, ex);
            }
        }

        public static async Task<IEnumerable<DistributionViewModel>> RunAsync(IEnumerable<DistributionViewModel> vm, string uri)
        {
            try
            {
                try
                {
                    var datasets = await GetDistributionsAsync(uri);

                    vm = datasets;

                }
                catch (Exception ex)
                {
                    throw ex;
                }

                return vm;
            }
            catch (Exception ex)
            {
                _client.CancelPendingRequests();
                throw new Exception("RunAsync caused an error: " + ex.Message, ex);
            }
        }

        internal static async Task<DataSetViewModel> RunAsync(DataSetViewModel vm, string uri)
        {
            try
            {
                try
                {
                    var datasets = await GetDatasetAsync(uri);

                    vm = datasets;

                }
                catch (Exception ex)
                {
                    throw ex;
                }

                return vm;
            }
            catch (Exception ex)
            {
                _client.CancelPendingRequests();
                throw new Exception("RunAsync caused an error: " + ex.Message, ex);
            }
        }

        static async Task<IEnumerable<GraphInfoModel>> GetGraphInfosAsync(string path)
        {
            IEnumerable<GraphInfoModel> vm = null;
            HttpResponseMessage response = await _client.GetAsync(path, HttpCompletionOption.ResponseContentRead);
            if (response.IsSuccessStatusCode)
            {
                try
                {
                    var json = response.Content.ReadAsStringAsync().Result;
                    vm = Newtonsoft.Json.JsonConvert.DeserializeObject(json, typeof(IEnumerable<GraphInfoModel>)) as IEnumerable<GraphInfoModel>;
                }
                catch (Exception ex)
                {
                    _client.CancelPendingRequests();
                    throw new Exception("GetDatasetAsync caused an error: " + ex.Message, ex);
                }
                
            }
            return vm;
        }

        static async Task<DataSetViewModel> GetDatasetAsync(string path)
        {
            DataSetViewModel vm = null;
            var response = await _client.GetAsync(path, HttpCompletionOption.ResponseContentRead);
            if (!response.IsSuccessStatusCode) return null;

            try
            {
                var json = response.Content.ReadAsStringAsync().Result;
                vm = Newtonsoft.Json.JsonConvert.DeserializeObject(json, typeof(DataSetViewModel)) as DataSetViewModel;
                return vm;
            }
            catch (Exception ex)
            {
                _client.CancelPendingRequests();
                throw new Exception("GetDatasetAsync caused an error: " + ex.Message, ex);
            }
        }



        static async Task<DataCatalogStatisticsViewModel> GetDataCatalogStatisticsAsync(string path)
        {
            DataCatalogStatisticsViewModel vm = null;
            HttpResponseMessage response = await _client.GetAsync(path, HttpCompletionOption.ResponseContentRead);
            if (response.IsSuccessStatusCode)
            {
                try
                {
                    var json = response.Content.ReadAsStringAsync().Result;
                    vm = Newtonsoft.Json.JsonConvert.DeserializeObject(json, typeof(DataCatalogStatisticsViewModel)) as DataCatalogStatisticsViewModel;
                }
                catch (Exception ex)
                {
                    _client.CancelPendingRequests();
                    throw new Exception("GetDataCatalogStatisticsAsync caused an error: " + ex.Message, ex);
                }

            }
            return vm;
        }

        static async Task<IEnumerable<DistributionViewModel>> GetDistributionsAsync(string url)
        {
            IEnumerable<DistributionViewModel> vm = null;
            HttpResponseMessage response = await _client.GetAsync(url, HttpCompletionOption.ResponseContentRead);
            if (response.IsSuccessStatusCode)
            {
                try
                {
                    var json = response.Content.ReadAsStringAsync().Result;
                    vm = Newtonsoft.Json.JsonConvert.DeserializeObject(json, typeof(IEnumerable<DistributionViewModel>)) as IEnumerable<DistributionViewModel>;
                }
                catch (Exception ex)
                {
                    _client.CancelPendingRequests();
                    throw new Exception("GetDistributionsAsync caused an error: " + ex.Message, ex);
                }

            }
            return vm;
        }

        private static async Task<DistributionViewModel> GetDistributionAsync(string url)
        {
            DistributionViewModel vm = null;
            HttpResponseMessage response = await _client.GetAsync(url, HttpCompletionOption.ResponseContentRead);
            if (response.IsSuccessStatusCode)
            {
                try
                {
                    var json = response.Content.ReadAsStringAsync().Result;
                    vm = Newtonsoft.Json.JsonConvert.DeserializeObject(json, typeof(DistributionViewModel)) as DistributionViewModel;
                }
                catch (Exception ex)
                {
                    _client.CancelPendingRequests();
                    throw new Exception("GetDistributionAsync caused an error: " + ex.Message, ex);
                }

            }
            return vm;
        }



        static async Task<IEnumerable<DataPublisher>> GetPublishersAsync(string path)
        {
            IEnumerable<DataPublisher> vm = null;
            HttpResponseMessage response = await _client.GetAsync(path, HttpCompletionOption.ResponseContentRead);
            if (response.IsSuccessStatusCode)
            {
                try
                {
                    var json = response.Content.ReadAsStringAsync().Result;
                    vm = Newtonsoft.Json.JsonConvert.DeserializeObject(json, typeof(IEnumerable<DataPublisher>)) as IEnumerable<DataPublisher>;
                }
                catch (Exception ex)
                {
                    _client.CancelPendingRequests();
                    throw new Exception("GetPublishersAsync caused an error: " + ex.Message, ex);
                }

            }
            return vm;
        }

        static async Task<IEnumerable<Organisation>> GetOrganisationsAsync(string path)
        {
            IEnumerable<Organisation> vm = null;
            HttpResponseMessage response = await _client.GetAsync(path, HttpCompletionOption.ResponseContentRead);
            if (response.IsSuccessStatusCode)
            {
                try
                {
                    var json = response.Content.ReadAsStringAsync().Result;
                    vm = Newtonsoft.Json.JsonConvert.DeserializeObject(json, typeof(IEnumerable<Organisation>)) as IEnumerable<Organisation>;
                }
                catch (Exception ex)
                {
                    _client.CancelPendingRequests();
                    throw new Exception("GetOrganisationsAsync caused an error: " + ex.Message, ex);
                }

            }
            return vm;
        }



    }
}