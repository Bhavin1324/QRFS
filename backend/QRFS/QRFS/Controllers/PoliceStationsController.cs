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
    public class PoliceStationsController : ControllerBase
    {
        private readonly QRFeedbackDBContext _context;

        public PoliceStationsController(QRFeedbackDBContext context)
        {
            _context = context;
        }

        // GET: api/PoliceStations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PoliceStation>>> GetPoliceStation()
        {
            return await _context.PoliceStation.ToListAsync();
        }

        // GET: api/PoliceStations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PoliceStation>> GetPoliceStation(string id)
        {
            var policeStation = await _context.PoliceStation.FindAsync(id);

            if (policeStation == null)
            {
                return NotFound();
            }

            return policeStation;
        }

        // PUT: api/PoliceStations/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPoliceStation(string id, PoliceStation policeStation)
        {
            policeStation.Id = id;
            if (id != policeStation.Id)
            {
                return BadRequest();
            }

            _context.Entry(policeStation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PoliceStationExists(id))
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

        // POST: api/PoliceStations
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<PoliceStation>> PostPoliceStation(PoliceStation policeStation)
        {
            policeStation.Id = Guid.NewGuid().ToString();
            _context.PoliceStation.Add(policeStation);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PoliceStationExists(policeStation.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPoliceStation", new { id = policeStation.Id }, policeStation);
        }

        // DELETE: api/PoliceStations/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<PoliceStation>> DeletePoliceStation(string id)
        {
            var policeStation = await _context.PoliceStation.FindAsync(id);
            if (policeStation == null)
            {
                return NotFound();
            }

            _context.PoliceStation.Remove(policeStation);
            await _context.SaveChangesAsync();

            return policeStation;
        }

        private bool PoliceStationExists(string id)
        {
            return _context.PoliceStation.Any(e => e.Id == id);
        }
    }
}
