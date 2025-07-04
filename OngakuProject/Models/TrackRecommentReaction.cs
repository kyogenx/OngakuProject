using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class TrackRecommentReaction : Base
    {
        public DateTime ReactedAt { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [ForeignKey("TrackRecomment")]
        public int? TrackRecommentId { get; set; }
        public User? User { get; set; }
        public TrackRecomment? TrackRecomment { get; set; }
    }
}
