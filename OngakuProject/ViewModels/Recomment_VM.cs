using OngakuProject.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class Recomment_VM
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Add some content to your reply")]
        [MaxLength(750, ErrorMessage = "Reply's content cannot contain more than 750 chars")]
        public string? Text { get; set; }
        public DateTime SentAt { get; set; }
        public DateTime? EditedAt { get; set; }
        [Required(ErrorMessage = "User information is required")]
        public int UserId { get; set; }
        public int? TrackCommentId { get; set; }
    }
}
