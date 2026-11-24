namespace ClearBeautyAPI.Models
{
    public class booking
    {
        public int id { get; set; }
        public int serviceId { get; set; }
        public string clientName { get; set; }
        public string clientPhone { get; set; }
        public DateTime bookingDate { get; set; } = DateTime.Now;
        public string status { get; set; } = "pending";

        
        public service service { get; set; }
    }
}