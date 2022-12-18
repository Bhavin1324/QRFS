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
    public class CommonResponse
    {
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
    }
    [Route("api/[controller]")]
    [ApiController]
    public class CitizenResponsesController : ControllerBase
    {
        private readonly QRFeedbackDBContext _context;

        public CitizenResponsesController(QRFeedbackDBContext context)
        {
            _context = context;
        }

        // GET: api/CitizenResponses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CitizenResponse>>> GetCitizenResponse()
        {
            return await _context.CitizenResponse.Include(x => x.Log).Include(x => x.Option).Include(x => x.Question).Include(x => x.Station).ToListAsync();
        }

        // GET: api/CitizenResponses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CitizenResponse>> GetCitizenResponse(string id)
        {
            var citizenResponse = await _context.CitizenResponse.Where(cresp => cresp.Id == id).Include(x => x.Station).Include(x => x.Log).Include(x => x.Option).Include(x => x.Question).FirstAsync();

            if (citizenResponse == null)
            {
                return NotFound();
            }

            return citizenResponse;
        }

        // PUT: api/CitizenResponses/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCitizenResponse(string id, CitizenResponse citizenResponse)
        {
            citizenResponse.Id = id;
            if (id != citizenResponse.Id)
            {
                return BadRequest();
            }
            _context.Entry(citizenResponse).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CitizenResponseExists(id))
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

        // POST: api/CitizenResponses
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<CommonResponse>> PostCitizenResponse(List<CitizenResponse> citizenResponses)
        {
            foreach(var response in citizenResponses)
            {
                response.Id = Guid.NewGuid().ToString();
                _context.CitizenResponse.Add(response);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                    if (CitizenResponseExists(response.Id))
                    {
                        return new CommonResponse() { IsSuccess= false, Message = "Similar id found. Primary key violated"};
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            return new CommonResponse() { IsSuccess = true };
        }

        // DELETE: api/CitizenResponses/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<CitizenResponse>> DeleteCitizenResponse(string id)
        {
            var citizenResponse = await _context.CitizenResponse.FindAsync(id);
            if (citizenResponse == null)
            {
                return NotFound();
            }

            _context.CitizenResponse.Remove(citizenResponse);
            await _context.SaveChangesAsync();

            return citizenResponse;
        }

        private bool CitizenResponseExists(string id)
        {
            return _context.CitizenResponse.Any(e => e.Id == id);
        }
    }
}
