
using MailKit.Net.Smtp;
using MimeKit;
using QRFS.Models;
using System.Collections.Generic;
using System;
using System.IO;
using System.Threading.Tasks;

namespace QRFS.Services
{
    public class EmailService : IEmailService
    {
        private readonly SMTPConfig _emailConfig;
        public EmailService(SMTPConfig emailConfig)
        {
            _emailConfig = emailConfig;
        }   
        public void SendEmail(Message message) 
        {
            var emailMessage = CreateEmailMessage(message);
            Send(emailMessage);
        }
        public async Task SendEmailAsync(Message message)
        {
            var emailMessage = CreateEmailMessage(message);
            await SendAsync(emailMessage);
        }
        private MimeMessage CreateEmailMessage(Message message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
            emailMessage.To.AddRange(message.EmailTo);
            emailMessage.Subject = message.Subject;

            // Creating and replacing placeholder for OTP
            var templateBody = File.ReadAllText(string.Format(@"EmailTemplates/{0}.html","OtpEmail"));
            List<KeyValuePair<string, string>> placeHolder = new List<KeyValuePair<string, string>>() 
            { 
                new KeyValuePair<string, string>("{{OTP}}", new Random().Next(100000, 999999).ToString()) 
            };
            message.Body = message.ReplacePlaceholder(templateBody, placeHolder);

            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text= message.Body };
            return emailMessage;
        }
        private void Send(MimeMessage mailMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    client.Connect(_emailConfig.SmtpServer, _emailConfig.Port, true);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    client.Authenticate(_emailConfig.Username, _emailConfig.Password);
                    client.Send(mailMessage);
                }
                catch {
                    throw;
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }
        private async Task SendAsync(MimeMessage mailMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(_emailConfig.SmtpServer, _emailConfig.Port, true);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    await client.AuthenticateAsync(_emailConfig.Username, _emailConfig.Password);
                    await client.SendAsync(mailMessage);
                }
                catch
                {
                    throw;
                }
                finally
                {
                    await client.DisconnectAsync(true);
                    client.Dispose();
                }
            }
        }
    }
}
