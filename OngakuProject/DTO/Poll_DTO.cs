using OngakuProject.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OngakuProject.DTO
{
    public class Poll_DTO
    {
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public string? Question { get; set; }
        public byte MaxChoicesQty { get; set; }
        public int NecessaryVoicesQty { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime? ForceFinishedAt { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsAnonymous { get; set; }
        public bool IsSkippable { get; set; }
        public int TotalVotesQty { get; set; }
        public int? VotedOptionId { get; set; }
        public int? PostId { get; set; }
        public int UserId { get; set; }
        public List<PollOption> PollOptions { get; set; } = new List<PollOption>();
        public List<PollOptionVote> PollOptionVotes { get; set; } = new List<PollOptionVote>();
    }
}
