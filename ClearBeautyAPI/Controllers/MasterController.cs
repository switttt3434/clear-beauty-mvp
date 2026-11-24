using ClearBeautyAPI.Data;
using ClearBeautyAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClearBeautyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MastersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MastersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/masters — список всех мастеров с их услугами
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Master>>> GetMasters([FromQuery] string? search)
        {
            var query = _context.Masters.Include(m => m.Services).AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m =>
                    m.Name.Contains(search) ||
                    m.Specialization.Contains(search) ||
                    m.District.Contains(search));
            }

            return await query.ToListAsync();
        }

        // GET: api/masters/5 — один мастер со всеми услугами
        [HttpGet("{id}")]
        public async Task<ActionResult<Master>> GetMaster(int id)
        {
            var master = await _context.Masters
                .Include(m => m.Services)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (master == null) return NotFound();
            return master;
        }
    }
}