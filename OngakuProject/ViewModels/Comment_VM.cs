using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class Comment_VM
    {
        public int Id { get; set; }
        [MaxLength(1500, ErrorMessage = "Comment content cannot contain more than 1500 chars")]
        [Required(ErrorMessage = "Comment content is required")]
        public string? Text { get; set; }
        public DateTime SentAt { get; set; }
        public DateTime? EditedAt { get; set; }
        [Required(ErrorMessage = "You must be signed in to send a comment")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "Track/Album information is not available")]
        public int TrackId { get; set; }
    }
}
