using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using QRFS.Helper;
using QRFS.Models;
using QRFS.Services;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;

namespace QRFS.Controllers
{
    public class OTP { public string Otp { get; set; } }

    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private IEmailService _emailService;
        private IConfiguration Configuration { get; }
        public LoginController(IEmailService emailService, IConfiguration configuration)
        {
            _emailService = emailService;
            Configuration = configuration;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("~/api/login")]
        public async Task<ActionResult<CitizenLoginCreds>> CitizenLogin(CitizenLoginCreds credentials)
        {
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
            var message = new Message(new string[] { credentials.CitizenEmail }, "OTP for providing feedback through QRF portal", "Message body");
            await _emailService.SendEmailAsync(message);

            // Storing OTP and Token in session
            HttpContext.Session.SetString("Token", token);
            HttpContext.Session.SetString("OTP",message.Otp.ToString());

            return new CitizenLoginCreds() { CitizenEmail = credentials.CitizenEmail, Token = token, loginSuccess= false };
        }

        [HttpPost]
        [Authorize]
        [Route("~/api/varify")]
        public ActionResult<CitizenLoginCreds> VerifyOtp(OTP otp)
        {
            if(Convert.ToInt32(HttpContext.Session.GetString("OTP")) == Convert.ToInt32(otp.Otp))
            {
                return new CitizenLoginCreds() { loginSuccess = true };
            }
            return new CitizenLoginCreds() { loginSuccess = false };
        }
    }
}
