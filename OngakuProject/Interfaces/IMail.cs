using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface IMail
    {
        public Task<bool> SendEmailMessageAsync(MailKit_VM MailKitModel, MailMessage_VM MessageModel);
    }
}
