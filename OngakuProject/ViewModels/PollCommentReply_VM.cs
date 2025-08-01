using OngakuProject.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class PollCommentReply_VM
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Comment text is required")]
        [MaxLength(500, ErrorMessage = "Comment reply cannot contain more than 500 characters")]
        public string? Text { get; set; }
        public bool IsEdited { get; set; }
        public DateTime SentAt { get; set; }
        [Required(ErrorMessage = "User info is required")]
        public int UserId { get; set; }
        public int? PollCommentId { get; set; }
    }
}
