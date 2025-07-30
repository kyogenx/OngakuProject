using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class PollOption : Base
    {
        [MaxLength(45)]
        public string? Option { get; set; }
        [ForeignKey("Poll")]
        public int? PollId { get; set; }
        public List<PollOptionVote>? Votes { get; set; }
        public Poll? Poll { get; set; }

        [NotMapped]
        public int VotesQty { get; set; }
    }
}
