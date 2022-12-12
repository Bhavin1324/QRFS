using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace QRFS.Helper
{
    public class JWTHelper
    {
        public static SymmetricSecurityKey SIGNIN_KEY;
               
        public string GenToken(JwtPayload payload, string secret, int expiryInHours)
        {
            SIGNIN_KEY = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var credentials = new SigningCredentials(SIGNIN_KEY, SecurityAlgorithms.HmacSha256);
            var header = new JwtHeader(credentials);
            DateTimeOffset now = (DateTimeOffset)DateTime.UtcNow.AddHours(expiryInHours);
            var tms = now.ToUnixTimeMilliseconds();
            payload.Add("exp", tms);
            var securityToken = new JwtSecurityToken(header, payload);
            var handler = new JwtSecurityTokenHandler();
            var tokenString = handler.WriteToken(securityToken);
            Console.WriteLine(tokenString);
            return tokenString;
        }
    }
}
