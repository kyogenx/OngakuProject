using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class MailMessage_VM
    {
        [Required]
        public string? From { get; set; } = "bluejade@mail.ru";
        [Required]
        public string? To { get; set; }
        [Required]
        public string? Title { get; set; }
        [Required]
        public string? Subject { get; set; }
        [Required]
        public string? Body { get; set; }
    }
}
