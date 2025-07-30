using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class Post : Base
    {
        [MaxLength(2000)]
        public string? Text { get; set; }
        public int MaxRepostsPerUser { get; set; } = 15; //from 0 to 45; if 0 cannot be reposted
        public bool IsEdited { get; set; }
        public bool IsDisabled { get; set; }
        public DateTime CreatedAt { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        [ForeignKey("Track")]
        public int? TrackId { get; set; }
        [ForeignKey("Poll")]
        public int? PollId { get; set; }

        public List<RePost>? RePosts { get; set; }
        public User? User { get; set; }
        public Track? Track { get; set; }
        public Poll? Poll { get; set; }
    }
}
