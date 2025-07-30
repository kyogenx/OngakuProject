using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class PollComment : Base
    {
        [MaxLength(750)]
        public string? Text { get; set; }
        public bool IsEdited { get; set; }
        public DateTime SentAt { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [ForeignKey("Poll")]
        public int? PollId { get; set; }
        public User? User { get; set; }
        public Poll? Poll { get; set; }
        public List<PollRecomment>? PollRecomments { get; set; }
    }
}
