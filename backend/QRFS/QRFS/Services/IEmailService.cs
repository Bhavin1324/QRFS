using QRFS.Models;
using System.Threading.Tasks;

namespace QRFS.Services
{
    public interface IEmailService
    {
        void SendEmail(Message message);
        Task SendEmailAsync(Message message);
    }
}