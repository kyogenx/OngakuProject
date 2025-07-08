using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class TrackRecomment : Base
    {
        [MaxLength(750)]
        public string? Text { get; set; }
        public DateTime SentAt { get; set; }
        public DateTime? EditedAt { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [ForeignKey("TrackComment")]
        public int? TrackCommentId { get; set; }
        public User? User { get; set; }
        public TrackComment? TrackComment { get; set; }
        public List<TrackRecommentReaction>? TrackRecommentReactions { get; set; } = new List<TrackRecommentReaction>();
        [NotMapped]
        public bool IsEdited { get; set; }
    }
}
