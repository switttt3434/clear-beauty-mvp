using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization; // ← ДОБАВЬ ЭТУ СТРОКУ

namespace ClearBeautyAPI.Models
{
    [Table("bookings")]
    public class Booking
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("service_id")]
        public int ServiceId { get; set; }

        [Column("client_name")]
        public string ClientName { get; set; }

        [Column("client_phone")]
        public string ClientPhone { get; set; }

        [Column("booking_date")]
        public DateTime BookingDate { get; set; } = DateTime.Now;

        [Column("status")]
        public string Status { get; set; } = "pending";

        // ← ДОБАВЬ ЭТОТ АТРИБУТ
        [JsonIgnore]
        public Service Service { get; set; }
    }
}