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
    public class PoliceOfficersController : ControllerBase
    {
        private readonly QRFeedbackDBContext _context;

        public PoliceOfficersController(QRFeedbackDBContext context)
        {
            _context = context;
        }

        // GET: api/PoliceOfficers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PoliceOfficer>>> GetPoliceOfficer()
        {
            return await _context.PoliceOfficer.Include(x => x.Station).ToListAsync();
        }

        // GET: api/PoliceOfficers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PoliceOfficer>> GetPoliceOfficer(string id)
        {
            var policeOfficer = await _context.PoliceOfficer.Where(log => log.Id == id).Include(x => x.Station).FirstAsync();

            if (policeOfficer == null)
            {
                return NotFound();
            }

            return policeOfficer;
        }

        // PUT: api/PoliceOfficers/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPoliceOfficer(string id, PoliceOfficer policeOfficer)
        {
            policeOfficer.Id = id;
            if (id != policeOfficer.Id)
            {
                return BadRequest();
            }

            _context.Entry(policeOfficer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PoliceOfficerExists(id))
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

        // POST: api/PoliceOfficers
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<PoliceOfficer>> PostPoliceOfficer(PoliceOfficer policeOfficer)
        {
            policeOfficer.Id = Guid.NewGuid().ToString();
            _context.PoliceOfficer.Add(policeOfficer);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PoliceOfficerExists(policeOfficer.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPoliceOfficer", new { id = policeOfficer.Id }, policeOfficer);
        }

        // DELETE: api/PoliceOfficers/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<PoliceOfficer>> DeletePoliceOfficer(string id)
        {
            var policeOfficer = await _context.PoliceOfficer.FindAsync(id);
            if (policeOfficer == null)
            {
                return NotFound();
            }

            _context.PoliceOfficer.Remove(policeOfficer);
            await _context.SaveChangesAsync();

            return policeOfficer;
        }

        private bool PoliceOfficerExists(string id)
        {
            return _context.PoliceOfficer.Any(e => e.Id == id);
        }
    }
}
