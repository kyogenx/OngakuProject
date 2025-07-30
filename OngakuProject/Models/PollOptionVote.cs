using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class PollOptionVote : Base
    {
        public DateTime VotedAt { get; set; }
        [ForeignKey("Poll")]
        public int? PollId { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [ForeignKey("PollOption")]
        public int PollOptionId { get; set; }
        public Poll? Poll { get; set; }
        public User? User { get; set; }
        public PollOption? PollOption { get; set; }
        [NotMapped]
        public int GroupVotesQty { get; set; }
    }
}
