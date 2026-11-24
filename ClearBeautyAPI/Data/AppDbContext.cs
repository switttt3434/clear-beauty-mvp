using ClearBeautyAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ClearBeautyAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Master> Masters { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Booking> Bookings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Явно указываем имена таблиц (в нижнем регистре, как в PostgreSQL)
            modelBuilder.Entity<Master>().ToTable("masters");
            modelBuilder.Entity<Service>().ToTable("services");
            modelBuilder.Entity<Booking>().ToTable("bookings");

            // Явно указываем имена колонок
            modelBuilder.Entity<Master>().Property(m => m.Id).HasColumnName("id");
            modelBuilder.Entity<Master>().Property(m => m.Name).HasColumnName("name");
            modelBuilder.Entity<Master>().Property(m => m.Specialization).HasColumnName("specialization");
            modelBuilder.Entity<Master>().Property(m => m.Phone).HasColumnName("phone");
            modelBuilder.Entity<Master>().Property(m => m.District).HasColumnName("district");
            modelBuilder.Entity<Master>().Property(m => m.Address).HasColumnName("address");
            modelBuilder.Entity<Master>().Property(m => m.Description).HasColumnName("description");

            modelBuilder.Entity<Service>().Property(s => s.Id).HasColumnName("id");
            modelBuilder.Entity<Service>().Property(s => s.MasterId).HasColumnName("master_id");
            modelBuilder.Entity<Service>().Property(s => s.Name).HasColumnName("name");
            modelBuilder.Entity<Service>().Property(s => s.Description).HasColumnName("description");
            modelBuilder.Entity<Service>().Property(s => s.Price).HasColumnName("price");
            modelBuilder.Entity<Service>().Property(s => s.DurationMinutes).HasColumnName("duration_minutes");

            modelBuilder.Entity<Booking>().Property(b => b.Id).HasColumnName("id");
            modelBuilder.Entity<Booking>().Property(b => b.ServiceId).HasColumnName("service_id");
            modelBuilder.Entity<Booking>().Property(b => b.ClientName).HasColumnName("client_name");
            modelBuilder.Entity<Booking>().Property(b => b.ClientPhone).HasColumnName("client_phone");
            modelBuilder.Entity<Booking>().Property(b => b.BookingDate).HasColumnName("booking_date");
            modelBuilder.Entity<Booking>().Property(b => b.Status).HasColumnName("status");

            // Связи
            modelBuilder.Entity<Service>()
                .HasOne(s => s.Master)
                .WithMany(m => m.Services)
                .HasForeignKey(s => s.MasterId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Service)
                .WithMany(s => s.Bookings)
                .HasForeignKey(b => b.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}