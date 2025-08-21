using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class PollLike : Base
    {
        public DateTime? LikedAt { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [ForeignKey("Poll")]
        public int? PollId { get; set; }
        public User? User { get; set; }
        public Poll? Poll { get; set; }
    }
}
