using ClearBeautyAPI.Data;
using ClearBeautyAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClearBeautyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingsController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/bookings — создать запись
        [HttpPost]
        public async Task<ActionResult<Booking>> CreateBooking(Booking booking)
        {
            booking.Status = "pending";
            booking.BookingDate = DateTime.Now;

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
        }

        // GET: api/bookings/5 — получить запись по ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.Service)
                    .ThenInclude(s => s.Master)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null) return NotFound();
            return booking;
        }
    }
}