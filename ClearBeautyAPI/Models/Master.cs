using System.Collections.Generic;

namespace ClearBeautyAPI.Models
{
    public class master
    {
        public int id { get; set; }
        public string name { get; set; }
        public string specialization { get; set; }
        public string phone { get; set; }
        public string district { get; set; }
        public string address { get; set; }
        public string description { get; set; }

        
        public List<Service> services { get; set; } = new List<Service>();
    }
}