using ClearBeautyAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ClearBeautyAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<master> Masters { get; set; }
        public DbSet<service> Services { get; set; }
        public DbSet<booking> Bookings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Настройка связи: один мастер → много услуг
            modelBuilder.Entity<service>()
                .HasOne(s => s.Master)
                .WithMany(m => m.services)
                .HasForeignKey(s => s.masterid);

            // Настройка связи: одна услуга → много записей
            modelBuilder.Entity<booking>()
                .HasOne(b => b.service)
                .WithMany(s => s.bookings)
                .HasForeignKey(b => b.serviceId);
        }
    }
}