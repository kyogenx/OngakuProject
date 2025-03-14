using MailKit.Net.Smtp;
using MimeKit;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.ViewModels;

namespace OngakuProject.Repositories
{
    public class MailRep : IMail
    {
        private readonly Context _context;
        public MailRep(Context context)
        {
            _context = context;
        }

        public async Task<bool> SendEmailMessageAsync(MailKit_VM MailKitModel, MailMessage_VM MessageModel)
        {
            if(!String.IsNullOrWhiteSpace(MessageModel.From) && !String.IsNullOrWhiteSpace(MessageModel.From))
            {
                using(MimeMessage mimeMessage = new MimeMessage())
                {
                    mimeMessage.From.Add(new MailboxAddress(MessageModel.Title, MessageModel.From));
                    mimeMessage.To.Add(new MailboxAddress(MessageModel.Title, MessageModel.To));
                    mimeMessage.Subject = MessageModel.Subject;
                    mimeMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
                    {
                        Text = MessageModel.Body
                    };
                    using(SmtpClient  smtpClient = new SmtpClient())
                    {
                        await smtpClient.ConnectAsync(MailKitModel.Host, MailKitModel.Port);
                        await smtpClient.AuthenticateAsync(MailKitModel.Email, MailKitModel.Password);
                        await smtpClient.SendAsync(mimeMessage);
                        await smtpClient.DisconnectAsync(true);

                        return true;
                    }
                }
            }
            return false;
        }
    }
}
