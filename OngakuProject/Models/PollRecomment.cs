using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OngakuProject.Models
{
    public class PollRecomment : Base
    {
        [MaxLength(500)]
        public string? Text { get; set; }
        public bool IsEdited { get; set; }
        public DateTime SentAt { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [ForeignKey("PollComment")]
        public int? PollCommentId { get; set; }
        public User? User { get; set; }
        public PollComment? PollComment { get; set; }
    }
}
