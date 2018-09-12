using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SepaClientApp.Models
{
    public class DataCatalogStatisticsViewModel
    {
            public int NumberOfDatasets { get; set; }
            public int NumberOfOrganisations { get; set; }
            public IEnumerable<string> MostRecentlyModifiedData { get; set; }
        public string WebApiBaseUrl { get; set; }
    }
}