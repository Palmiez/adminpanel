namespace SepaClientApp.Models
{
    public class DataPublisher
    {
        public DataPublisher()
        {
            Count = 0;
        }
        public string Name { get; set; }
        public string Uri { get; set; }
        public int Count { get; set; }
    }

    public class Organisation
    {
        public string Uri { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
        public string HomePageUrl { get; set; }
        public string Logo { get; set; }
        public int DatasetCount { get; set; }

    }
}