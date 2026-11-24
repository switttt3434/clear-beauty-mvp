using System.Collections.Generic;

namespace ClearBeautyAPI.Models
{
    public class service
    {
        public int id { get; set; }
        public int masterid { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int price { get; set; }
        public int durationMinutes { get; set; }

        public master Master { get; set; }
        public List<booking> bookings { get; set; } = new List<booking>();
    }
}