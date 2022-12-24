using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Math.EC.Rfc7748;
using QRFS.Helper;
using QRFS.Models;
using QRFS.QueryModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace QRFS.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private QRFeedbackDBContext Context;
        public StatisticsController(QRFeedbackDBContext context) {
            Context = context;
        }
        // GET: api/<StatisticsController>
        [HttpGet]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IEnumerable<CitizenResponsePerMonth>> GetCitizenResponsePerMonth()
        {
            try
            {
                List<CitizenResponse> lstResponse = await Context.CitizenResponse.ToListAsync();
                var responseQueryData = from c in lstResponse.GroupBy(x => x.ResponseDate) select new CitizenResponsePerDate() { qCount = c.Count(), DateString = c.First().ResponseDate };
                return QueryHelper.DateToMonthResp(responseQueryData.ToList());
            }
            catch
            {
                return (IEnumerable<CitizenResponsePerMonth>)NotFound();
            }
        }

        // GET api/<StatisticsController>/5
        [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IEnumerable<CitizenResponsePerMonth>> GetCitizenResponsePerMonthByPoliceStation(string id)
        {
            try
            {
                List<CitizenResponse> lstResponse = await Context.CitizenResponse.ToListAsync();
                var responseQueryData = from c in lstResponse.Where(x => x.StationId == id).GroupBy(x => x.ResponseDate) select new CitizenResponsePerDate() { qCount = c.Count(), DateString = c.First().ResponseDate };
                return QueryHelper.DateToMonthResp(responseQueryData.ToList());
            }
            catch
            {
                return (IEnumerable<CitizenResponsePerMonth>)NotFound();
            }
        }

        [HttpGet("rating/{id}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<CitizenResponseRatingInt>> GetRating(string id) {
            var lstOptions = await Context.Options.ToListAsync();  
            var lstCitizenResponse = await Context.CitizenResponse.ToListAsync();
            var joinTable = from o in lstOptions
                            join cr in lstCitizenResponse on o.Id equals cr.OptionId where o.Id == cr.OptionId
                            select new { OptionText = o.Text, OptionId = cr.OptionId, QuestionId = cr.QuestionId, StationId = cr.StationId };
            var resp = from x in joinTable
                       .Where(item => item.StationId == id && item.QuestionId == "7db51d89-d8f3-4319-9cf2-fc8a83efbb9a")
                       .GroupBy(item => new { item.OptionId, item.StationId, item.OptionText })
                       select new CitizenResponseRating()
                       {
                           qCount = x.Count(),
                           OptionText = x.First().OptionText,
                           StationId = x.First().StationId,
                           OptionId = x.First().OptionId,
                       };
            return QueryHelper.GetAverageRating(resp.ToList());
        }
    }
}
