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
            DateTime Expiry = DateTime.UtcNow.AddHours(Convert.ToInt32(expiryInHours));
            int ts = (int)(Expiry - new DateTime(1970, 1, 1)).TotalSeconds;
            payload.Add("exp", ts);
            var securityToken = new JwtSecurityToken(header, payload);
            var handler = new JwtSecurityTokenHandler();
            var tokenString = handler.WriteToken(securityToken);
            Console.WriteLine(tokenString);
            return tokenString;
        }
    }
}
