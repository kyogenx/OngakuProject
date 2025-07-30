using OngakuProject.Models;
using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class PollComment_VM
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Comment must contain some text?")]
        [MaxLength(750, ErrorMessage = "Comment's text cannot contain more than 750 characters")]
        public string? Text { get; set; }
        public bool IsEdited { get; set; }
        public DateTime SentAt { get; set; }
        [Required(ErrorMessage = "User information is required")]
        public int UserId { get; set; }
        public int? PollId { get; set; }
    }
}
