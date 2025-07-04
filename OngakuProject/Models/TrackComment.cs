using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class TrackComment : Base
    {
        [MaxLength(1500)]
        public string? Text { get; set; }
        public DateTime SentAt { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [ForeignKey("Track")]
        public int TrackId { get; set; }
        public User? User { get; set; }
        public Track? Track { get; set; }
        public List<TrackCommentReaction>? TrackCommentReactions { get; set; } = new List<TrackCommentReaction>();
    }
}
