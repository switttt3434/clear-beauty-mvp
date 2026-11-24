namespace ClearBeautyAPI.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public string ClientName { get; set; }
        public string ClientPhone { get; set; }
        public DateTime BookingDate { get; set; } = DateTime.Now;
        public string Status { get; set; } = "pending";

        // Навигационное свойство
        public Service Service { get; set; }
    }
}