using System.Collections.Generic;

namespace ClearBeautyAPI.Models
{
    public class Service
    {
        public int Id { get; set; }
        public int MasterId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public int DurationMinutes { get; set; }

        // Навигационные свойства
        public Master Master { get; set; }
        public List<Booking> Bookings { get; set; } = new List<Booking>();
    }
}