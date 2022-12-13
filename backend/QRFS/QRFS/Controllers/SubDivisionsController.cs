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
    public class SubDivisionsController : ControllerBase
    {
        private readonly QRFeedbackDBContext _context;

        public SubDivisionsController(QRFeedbackDBContext context)
        {
            _context = context;
        }

        // GET: api/SubDivisions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubDivision>>> GetSubDivision()
        {
            return await _context.SubDivision.Include(x => x.PoliceStation).ToListAsync();
        }

        // GET: api/SubDivisions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SubDivision>> GetSubDivision(string id)
        {
            var subDivision = await _context.SubDivision.Where(x => x.Id == id).Include(x => x.PoliceStation).FirstAsync();

            if (subDivision == null)
            {
                return NotFound();
            }

            return subDivision;
        }

        // PUT: api/SubDivisions/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubDivision(string id, SubDivision subDivision)
        {
            subDivision.Id = id;
            if (id != subDivision.Id)
            {
                return BadRequest();
            }

            _context.Entry(subDivision).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubDivisionExists(id))
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

        // POST: api/SubDivisions
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<SubDivision>> PostSubDivision(SubDivision subDivision)
        {
            subDivision.Id = Guid.NewGuid().ToString();
            _context.SubDivision.Add(subDivision);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SubDivisionExists(subDivision.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetSubDivision", new { id = subDivision.Id }, subDivision);
        }

        // DELETE: api/SubDivisions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<SubDivision>> DeleteSubDivision(string id)
        {
            var subDivision = await _context.SubDivision.FindAsync(id);
            if (subDivision == null)
            {
                return NotFound();
            }

            _context.SubDivision.Remove(subDivision);
            await _context.SaveChangesAsync();

            return subDivision;
        }

        private bool SubDivisionExists(string id)
        {
            return _context.SubDivision.Any(e => e.Id == id);
        }
    }
}
