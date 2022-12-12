namespace QRFS.Models
{
    public class JWTConf
    {
        public string SECRET_KEY { get; set; }
        public int LIFETIME_IN_HRS { get; set; }
    }
}
