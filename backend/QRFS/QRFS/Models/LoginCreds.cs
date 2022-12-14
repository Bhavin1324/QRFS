using System.Collections.Generic;

namespace QRFS.Models
{
    public class LoginCreds
    {
        public string Email { get; set; }
        public string? Password{ get; set; }
        public bool? LoginSuccess{ get; set; }
        public string? Otp { get; set; }
        public string? Token { get; set; }
    }
}
