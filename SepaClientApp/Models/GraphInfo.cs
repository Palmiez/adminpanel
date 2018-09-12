using System;

namespace SepaClientApp.Models
{
    public class GraphInfo
    {
        public string GraphId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime PublishedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public string Keyword { get; set; }
        public string Theme { get; set; }
        public int NumberOfDistributions { get; set; }
        public string Publisher { get; set; }

    }
}