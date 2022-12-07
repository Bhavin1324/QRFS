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
    public class FeedbackLogsController : ControllerBase
    {
        private readonly QRFeedbackDBContext _context;

        public FeedbackLogsController(QRFeedbackDBContext context)
        {
            _context = context;
        }

        // GET: api/FeedbackLogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeedbackLog>>> GetFeedbackLog()
        {
            return await _context.FeedbackLog.Include(x => x.Station).ToListAsync();
        }

        // GET: api/FeedbackLogs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FeedbackLog>> GetFeedbackLog(string id)
        {
            var feedbackLog = await _context.FeedbackLog.Where(log =>log.Id == id).Include(x => x.Station).FirstAsync();

            if (feedbackLog == null)
            {
                return NotFound();
            }

            return feedbackLog;
        }

        // PUT: api/FeedbackLogs/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFeedbackLog(string id, FeedbackLog feedbackLog)
        {
            feedbackLog.Id = id;
            if (id != feedbackLog.Id)
            {
                return BadRequest();
            }

            _context.Entry(feedbackLog).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FeedbackLogExists(id))
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

        // POST: api/FeedbackLogs
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<FeedbackLog>> PostFeedbackLog(FeedbackLog feedbackLog)
        {
            feedbackLog.Id = Guid.NewGuid().ToString();
            _context.FeedbackLog.Add(feedbackLog);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (FeedbackLogExists(feedbackLog.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetFeedbackLog", new { id = feedbackLog.Id }, feedbackLog);
        }

        // DELETE: api/FeedbackLogs/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<FeedbackLog>> DeleteFeedbackLog(string id)
        {
            var feedbackLog = await _context.FeedbackLog.FindAsync(id);
            if (feedbackLog == null)
            {
                return NotFound();
            }

            _context.FeedbackLog.Remove(feedbackLog);
            await _context.SaveChangesAsync();

            return feedbackLog;
        }

        private bool FeedbackLogExists(string id)
        {
            return _context.FeedbackLog.Any(e => e.Id == id);
        }
    }
}
