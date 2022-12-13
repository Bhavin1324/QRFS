using System;
using System.Text;

namespace QRFS.Helper
{
    public static class EncDecHelper
    {
        public static string Encrypt(string key, string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                return "";
            }
            else
            {
                password = password + key;
                var passInBytes = Encoding.UTF8.GetBytes(password);
                return Convert.ToBase64String(passInBytes); 
            }
        }
        public static string Decrypt(string key, string encryptedPassword)
        {
            if (string.IsNullOrEmpty(encryptedPassword))
            {
                return "";
            }
            else
            {
                var encBytes = Convert.FromBase64String(encryptedPassword);
                var password = Encoding.UTF8.GetString(encBytes);
                password = password.Substring(0, password.Length - key.Length);
                return password;
            }
        }
    }
}
