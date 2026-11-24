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
        public async Task<ActionResult<IEnumerable<master>>> GetMasters([FromQuery] string? search)
        {
            var query = _context.Masters.Include(m => m.services).AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m =>
                    m.name.Contains(search) ||
                    m.specialization.Contains(search) ||
                    m.district.Contains(search));
            }

            return await query.ToListAsync();
        }

        // GET: api/masters/5 — один мастер со всеми услугами
        [HttpGet("{id}")]
        public async Task<ActionResult<master>> GetMaster(int id)
        {
            var master = await _context.Masters
                .Include(m => m.services)
                .FirstOrDefaultAsync(m => m.id == id);

            if (master == null) return NotFound();
            return master;
        }
    }
}