using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using QRFS.Helper;
using QRFS.Models;
using QRFS.Services;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;



namespace QRFS.Controllers
{
    public class ActivatedUser
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string qrUrl { get; set; }
        public string StationName { get; set; }
        public string StationArea { get; set; }
        public string StationSubDivision { get; set; }
        public string StationDistrict { get; set; }
    }
    public enum UserType
    {
        MASTER,
        ADMIN,
        CLIENT
    }
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly QRFeedbackDBContext _context;
        private IEmailService _emailService;
        private IConfiguration Configuration { get; }
        private static Dictionary<string, int> _authInfo = new Dictionary<string, int>();
        private JWTHelper jwt = new JWTHelper();
        public LoginController(IEmailService emailService, IConfiguration configuration, QRFeedbackDBContext context)
        {
            _context = context;
            _emailService = emailService;
            Configuration = configuration;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("~/api/login")]
        public async Task<ActionResult<LoginCreds>> CitizenLogin(LoginCreds credentials)
        {
            if (string.IsNullOrEmpty(credentials.Email))
            {
                return BadRequest();
            }
            var message = new Message(new string[] { credentials.Email }, "OTP for providing feedback through QRF portal", "Message body");
            await _emailService.SendEmailAsync(message);

            if (!_authInfo.ContainsKey(credentials.Email))
            {
                _authInfo.Add(credentials.Email, message.Otp);
            }
            else
            {
                _authInfo.Remove(credentials.Email);
                _authInfo.Add(credentials.Email, message.Otp);
            }
            return new LoginCreds() { Email = credentials.Email, LoginSuccess= false };
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("~/api/varify")]
        public ActionResult<LoginCreds> VerifyOtp(LoginCreds credentials)
        {
            try
            {
                if (Convert.ToInt32(credentials.Otp) == _authInfo[credentials.Email])
                {
                    _authInfo.Remove(credentials.Email);
                    
                    var payload = new JwtPayload
                    {
                        { "email", credentials.Email },
                        { "type", UserType.CLIENT.ToString() }
                    };
                    string token = jwt.GenToken(
                        payload,
                        Configuration.GetSection("JWTConfig").GetSection("SECRET_KEY").Value,
                        Convert.ToInt32(Configuration.GetSection("JWTConfig").GetSection("LIFETIME_IN_HRS").Value)
                    );
                    return new LoginCreds() { LoginSuccess = true, Token = token };
                }
                return new LoginCreds() { LoginSuccess = false };
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("~/api/login/officer")]
        public async Task<ActionResult<LoginCreds>> OfficerLogin(LoginCreds user)
        {
            try
            {
                var dbUser = await _context.PoliceOfficer.Where(x => x.OfficerEmail == user.Email).FirstOrDefaultAsync();
                if(dbUser != null && EncDecHelper.Decrypt(Configuration["PassConfig:PASS_KEY"], dbUser.OfficerPassword) == user.Password)
                {
                    var payload = new JwtPayload 
                    {
                        { "email", user.Email },
                        { "type", UserType.MASTER.ToString() }
                    };
                    string token = jwt.GenToken(
                        payload,
                        Configuration.GetSection("JWTConfig").GetSection("SECRET_KEY").Value,
                        Convert.ToInt32(Configuration.GetSection("JWTConfig").GetSection("LIFETIME_IN_HRS").Value)
                    );
                    return new LoginCreds() { LoginSuccess = true, Token = token };
                }
                else if (user.Email.Equals(Configuration["AdminConf:EMAIL"]) && user.Password.Equals(Configuration["AdminConf:PASSWORD"]))
                {
                    var payload = new JwtPayload
                    {
                        { "email", user.Email },
                        { "type", UserType.ADMIN.ToString() }
                    };
                    string token = jwt.GenToken(
                        payload,
                        Configuration.GetSection("JWTConfig").GetSection("SECRET_KEY").Value,
                        Convert.ToInt32(Configuration.GetSection("JWTConfig").GetSection("LIFETIME_IN_HRS").Value)
                    );
                    return new LoginCreds() { LoginSuccess = true, Token = token };
                }
                return new LoginCreds() { LoginSuccess = false };
            }
            catch 
            {
                return new LoginCreds() { LoginSuccess = false };
            }
        }
        [HttpPost]
        [Authorize(AuthenticationSchemes ="Bearer")]
        [Route("~/api/loggedin")]
        public async Task<ActionResult<ActivatedUser>> GetOfficerByEmail(LoginCreds user)
        {
            var officer = await _context.PoliceOfficer.Where(x => x.OfficerEmail.Equals(user.Email)).Include(x => x.Station).FirstAsync();
            var station = await _context.PoliceStation.Where(x => x.Id == officer.StationId).FirstAsync();
            var area = await _context.Area.Where(x => x.Id == station.AreaId).FirstAsync();
            var subDiv = await _context.SubDivision.Where(x => x.Id == station.SubDivisionId).FirstAsync();
            var dist = await _context.District.Where(x => x.Id == station.DistrictId).FirstAsync();
            if(user == null)
            {
                return NotFound();
            }
            return new ActivatedUser() { Name = officer.Name, qrUrl=station.QrUrl, Email = officer.OfficerEmail, StationName = station.Name, StationArea = area.Name,StationSubDivision = subDiv.Name, StationDistrict = dist.Name};
        }
    }
}
