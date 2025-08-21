using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class Poll : Base
    {
        [MaxLength(140)]
        public string? Question { get; set; }
        public byte MaxChoicesQty { get; set; } = 1; //Up to 6 (max options qty: 6);
        public int NecessaryVoicesQty { get; set; }
        public int LikesQty { get; set; }
        public int CommsQty { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime? ForceFinishedAt { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsAnonymous { get; set; }
        public bool IsSkippable { get; set; } //if true show votes without voting; after skipping user cannot vote
        [ForeignKey("Post")]
        public int? PostId { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public Post? Post { get; set; }
        public User? User { get; set; }
        public List<PollOption>? PollOptions { get; set; }
        public List<PollOptionVote>? PollOptionVotes { get; set; }
        public List<PollLike>? PollLikes { get; set; }
        public List<PollComment>? PollComments { get; set; }

        [NotMapped]
        public int TotalVotesQty { get; set; }
    }
}
