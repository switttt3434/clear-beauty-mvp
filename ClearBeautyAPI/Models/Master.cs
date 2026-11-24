using System.Collections.Generic;

namespace ClearBeautyAPI.Models
{
    public class Master
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Specialization { get; set; }
        public string Phone { get; set; }
        public string District { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }

        // Навигационное свойство: у мастера много услуг
        public List<Service> Services { get; set; } = new List<Service>();
    }
}