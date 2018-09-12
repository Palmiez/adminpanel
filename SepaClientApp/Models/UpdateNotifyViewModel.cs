using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SepaClientApp.Models
{
    public class UpdateNotifyViewModel
    {
        [Display(Name = "Catalog ID", Description = "The Catalog which contains the dataset for which data has been upldated.")]
        [StringLength(60, MinimumLength = 3)]
        public string CatalogId { get; set; }

        [Display(Name = "Dataset ID")]
        [StringLength(60, MinimumLength = 3)]
        public string DatasetId { get; set; }

        [Display(Name = "Distribution ID")]
        [StringLength(60, MinimumLength = 3)]
        public string DistributionId { get; set; }

        [Display(Name = "Updated Date", Description = "The Date when the data for the distribution was uploaded or modified.")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public string ModifiedDate { get; set; }

        [Display(Name = "License Type")]
        [StringLength(60, MinimumLength = 3)]
        public string LicenseTitle { get; set; }
        [Display(Name = "License Text")]
        public string LicenseText { get; set; }

        [Display(Name = "Catalog")]
        public IEnumerable<LookupField> CatalogList { get; set; }
        [Display(Name = "Dataset")]
        public IEnumerable<LookupField> DatasetList { get; set; }
        [Display(Name = "Distributions")]
        public IEnumerable<LookupField> DistributionList { get; set; }
        [Display(Name = "Licenses")]
        public IEnumerable<LookupField> LicenseList { get; set; }
        [Display(Name = "Distribution Dictionary")]
        public IDictionary<string, IEnumerable<LookupField>> DistributionDict { get; set; }
    }

    public class LookupField
    {

        public LookupField(string id, string displayValue)
        {
            Id = id;
            DisplayValue = displayValue;
        }

        public LookupField()
        {
            
        }

        public string Id { get; set; }
        public string DisplayValue { get; set; }
        public bool IsSelected { get; set; }
        
    }
}