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
using System.Net;
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
            var message = new Message(new string[] { credentials.CitizenEmail }, "OTP for providing feedback through QRF portal", "Message body");
            await _emailService.SendEmailAsync(message);
            HttpContext.Session.SetString("OTP",message.Otp.ToString()); //Storing OTP in session
            HttpContext.Session.SetString("Email", credentials.CitizenEmail); // Storing current user email in session
            return new CitizenLoginCreds() { CitizenEmail = credentials.CitizenEmail, LoginSuccess= false };
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("~/api/varify")]
        public ActionResult<CitizenLoginCreds> VerifyOtp(OTP otp)
        {
            var storedOtp = HttpContext.Session.GetString("OTP");
            var storedEmail = HttpContext.Session.GetString("Email");
            if(otp.Otp == storedOtp)
            {
                JWTHelper jwt = new JWTHelper();
                var payload = new JwtPayload
                {
                { "email", storedEmail }
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
    }
}
