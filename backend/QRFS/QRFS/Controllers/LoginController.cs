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
    public class CommonLoginCred
    {
        public string EmailOrUsername { get; set; }
        public string Password { get; set; }
        public bool? isSuccess { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly QRFeedbackDBContext _context;
        private IEmailService _emailService;
        private IConfiguration Configuration { get; }
        private static Dictionary<string, int> _authInfo = new Dictionary<string, int>();
        public LoginController(IEmailService emailService, IConfiguration configuration, QRFeedbackDBContext context)
        {
            _context = context;
            _emailService = emailService;
            Configuration = configuration;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("~/api/login")]
        public async Task<ActionResult<CitizenLoginCreds>> CitizenLogin(CitizenLoginCreds credentials)
        {
            if (string.IsNullOrEmpty(credentials.CitizenEmail))
            {
                return BadRequest();
            }
            var message = new Message(new string[] { credentials.CitizenEmail }, "OTP for providing feedback through QRF portal", "Message body");
            await _emailService.SendEmailAsync(message);

            if (!_authInfo.ContainsKey(credentials.CitizenEmail))
            {
                _authInfo.Add(credentials.CitizenEmail, message.Otp);
            }
            else
            {
                _authInfo.Remove(credentials.CitizenEmail);
                _authInfo.Add(credentials.CitizenEmail, message.Otp);
            }
            return new CitizenLoginCreds() { CitizenEmail = credentials.CitizenEmail, LoginSuccess= false };
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("~/api/varify")]
        public ActionResult<CitizenLoginCreds> VerifyOtp(CitizenLoginCreds credentials)
        {
            try
            {
                if (Convert.ToInt32(credentials.Otp) == _authInfo[credentials.CitizenEmail])
                {
                    _authInfo.Remove(credentials.CitizenEmail);
                    JWTHelper jwt = new JWTHelper();
                    var payload = new JwtPayload
                    {
                    { "email", credentials.CitizenEmail }
                    };
                    string token = jwt.GenToken(
                        payload,
                        Configuration.GetSection("JWTConfig").GetSection("SECRET_KEY").Value,
                        Convert.ToInt32(Configuration.GetSection("JWTConfig").GetSection("LIFETIME_IN_HRS").Value)
                    );
                    return new CitizenLoginCreds() { LoginSuccess = true, Token = token };
                }
                return new CitizenLoginCreds() { LoginSuccess = false };
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("~/api/login/officer")]
        public async Task<ActionResult<CommonLoginCred>> OfficerLogin(CommonLoginCred user)
        {
            try
            {
                var dbUser = await _context.PoliceOfficer.Where(x => x.OfficerEmail == user.EmailOrUsername).FirstOrDefaultAsync();
                if(dbUser != null && EncDecHelper.Decrypt(Configuration["PassConfig:PASS_KEY"], dbUser.OfficerPassword) == user.Password)
                {
                    return new CommonLoginCred() { isSuccess = true };
                }
                return new CommonLoginCred() { isSuccess=false };
            }
            catch 
            {
                return new CommonLoginCred() { isSuccess = false };
            }
        }
    }
}
