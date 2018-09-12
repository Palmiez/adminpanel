using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SepaClientApp.Models
{
    public class DataSetViewModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public UriLookup Publisher { get; set; }
        public IEnumerable<UriLookup>  Themes { get; set; }
        public IEnumerable<string> Keywords { get; set; }
        public DateTime Modified { get; set; }
        public DateTime Issued { get; set; }
        public IEnumerable<DistributionLookup> Distributions { get; set; }
        public IEnumerable<string> ContactPoints { get; set; }
        public string AccrualPeriodicity { get; set; }
    }

    public class UriLookup
    {
        public string Uri { get; set; }
        public string Label { get; set; }
        public string Name { get; set; }
    }

    public class DistributionLookup
    {
        public string Uri { get; set; }
        public string Label { get; set; }
        public string Name { get; set; }
        public string AccessUrl { get; set; }
        public string Ssdi { get; set; }
        public string SsdiXml { get; set; }

    }
}