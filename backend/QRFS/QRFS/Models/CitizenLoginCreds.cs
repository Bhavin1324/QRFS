using System.Collections.Generic;

namespace QRFS.Models
{
    public class CitizenLoginCreds
    {
        public string CitizenEmail { get; set; }
        public int? Otp { get; set; }
        public string? Token { get; set; }
    }
}
