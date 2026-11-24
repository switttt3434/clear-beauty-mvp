using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization; // ← ДОБАВЬ ЭТУ СТРОКУ

namespace ClearBeautyAPI.Models
{
    [Table("services")]
    public class Service
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("master_id")]
        public int MasterId { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("price")]
        public int Price { get; set; }

        [Column("duration_minutes")]
        public int DurationMinutes { get; set; }

        // ← ДОБАВЬ ЭТОТ АТРИБУТ, ЧТОБЫ РАЗОРВАТЬ ЦИКЛ
        [JsonIgnore]
        public Master Master { get; set; }

        public List<Booking> Bookings { get; set; } = new List<Booking>();
    }
}