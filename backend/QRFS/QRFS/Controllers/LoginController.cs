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

        //POST: api/Login
        [HttpPost]
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
            return new CitizenLoginCreds() { CitizenEmail = credentials.CitizenEmail, Otp = message.Otp, Token = token };
        }

        [HttpGet]
        [Authorize]
        public string AccessService()
        {
            return "Service accessed";
        }
    }
}
