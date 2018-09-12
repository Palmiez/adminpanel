using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace SepaClientApp.Models
{
    public class DistributionViewModel
    {
       public int Id { get; private set; }
        public int GraphTableId { get; set; }
        public string DistributionId { get; set; }
        [JsonProperty(propertyName: "@id"), Required]
        public string GraphItemId { get; set; }
        [JsonProperty(propertyName: "@type")]
        public string GraphItemType { get; set; }
        public string Legend { get; set; } = "";
        public string MapLayer { get; set; } = "";
        public string MinScale { get; set; } = "0";
        public string MaxScale { get; set; } = "0";
        public string Ssdi { get; set; } = "";
        public string SsdiXml { get; set; } = "";
        public string AccessUrl { get; set; } = "";
        [JsonProperty(propertyName: "format")]
        public string DistributionFormat { get; set; } = "";
        public string MediaType { get; set; }
        public string DownloadUrl { get; set; } = "";
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public string License { get; set; } = "";
        public IEnumerable<DistributionFormatItem> DistributionFormatItems { get; set; }

        //public IEnumerable<MapLayerField> IdentityFields { get; set; }
        [JsonProperty(propertyName: "identityFields")]
        public string IdentityFieldCsv { get; set; }
        [JsonProperty(propertyName: "identityFieldsAlias")]
        public string IdentityFieldAliasCsv { get; set; }
        
    }

    public class DistributionFormatItem
    {
        public string Mediatype { get; set; }
        public string Name { get; set; }

    }

    public class MapLayerField
    {      
        public int IdentityFieldId { get; set; }
        public string FieldValue { get; set; }
        public string FieldAlias { get; set; }
    }
}