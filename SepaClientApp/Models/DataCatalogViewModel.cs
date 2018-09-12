using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Web;
using SepaClientApp.Services;

namespace SepaClientApp.Models
{
    public class DataCatalogViewModel
    {
        public string WebApiBaseUrl { get; set; }
        public IEnumerable<GraphInfoModel> DataSets { get; set; }
        public IEnumerable<DataPublisher> Publishers { get; set; }
        public IEnumerable<DistributionLicense> Licenses { get; set; }
        public IEnumerable<SupportedApplication> Applications { get; set; }
        public IEnumerable<Organisation> Organisations { get; set; }
    }

    public class SupportedApplication
    {
        public SupportedApplication(string name, string uri)
        {
            Name = name;
            Uri = uri;
            Count = 0;
        }
        public string Name { get; set; }
        public string Uri { get; set; }
        public int Count { get; set; }
    }

    public class DistributionLicense
    {
        public DistributionLicense(string name, string uri)
        {
            Name = name;
            Uri = uri;
            Count = 0;
        }
        public string Name { get; set; }
        public string Uri { get; set; }
        public int Count { get; set; }
        

        
    }
}