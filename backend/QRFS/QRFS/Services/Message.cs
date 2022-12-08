using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.Extensions.Options;
using MimeKit;
using QRFS.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace QRFS.Services
{
    public class Message
    {
        public List<MailboxAddress> EmailTo { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public int Otp { get; set; }

        public Message(IEnumerable<string> emailTo, string subject, string body) 
        {
            EmailTo = new List<MailboxAddress>();
            EmailTo.AddRange(emailTo.Select(item => new MailboxAddress(item)));
            Subject = subject;
            Body = body;
            
        }
        public string ReplacePlaceholder(string bodyText, List<KeyValuePair<string, string>> keyValuePairs)
        {
            if (!string.IsNullOrEmpty(bodyText) && keyValuePairs != null)
            {
                foreach (var placeholder in keyValuePairs)
                {
                    if (bodyText.Contains(placeholder.Key))
                    {
                        bodyText = bodyText.Replace(placeholder.Key, placeholder.Value);
                        Otp = Convert.ToInt32(placeholder.Value);
                    }
                }
            }
            return bodyText;
        }
    }
}
