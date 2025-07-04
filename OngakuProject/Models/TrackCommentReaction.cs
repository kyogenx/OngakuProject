using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class TrackCommentReaction : Base
    {
        public DateTime ReactedAt { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [ForeignKey("TrackComment")]
        public int? TrackCommentId { get; set; }
        public User? User { get; set; }
        public TrackComment? TrackComment { get; set; }
    }
}
