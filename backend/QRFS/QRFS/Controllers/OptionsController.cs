using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QRFS.Models;

namespace QRFS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OptionsController : ControllerBase
    {
        private readonly QRFeedbackDBContext _context;

        public OptionsController(QRFeedbackDBContext context)
        {
            _context = context;
        }

        // GET: api/Options
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Options>>> GetOptions()
        {
            return await _context.Options.Include(x => x.Question).ToListAsync();
        }

        // GET: api/Options/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Options>> GetOptions(string id)
        {
            var options = await _context.Options.Where(x => x.Id == id).Include(x => x.Question).FirstAsync();

            if (options == null)
            {
                return NotFound();
            }

            return options;
        }

        // PUT: api/Options/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOptions(string id, Options options)
        {
            options.Id= id;
            if (id != options.Id)
            {
                return BadRequest();
            }

            _context.Entry(options).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OptionsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Options
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Options>> PostOptions(Options options)
        {
            options.Id = Guid.NewGuid().ToString();
            _context.Options.Add(options);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (OptionsExists(options.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetOptions", new { id = options.Id }, options);
        }

        // DELETE: api/Options/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Options>> DeleteOptions(string id)
        {
            var options = await _context.Options.FindAsync(id);
            if (options == null)
            {
                return NotFound();
            }

            _context.Options.Remove(options);
            await _context.SaveChangesAsync();

            return options;
        }

        private bool OptionsExists(string id)
        {
            return _context.Options.Any(e => e.Id == id);
        }
    }
}
