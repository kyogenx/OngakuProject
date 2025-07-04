using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class TrackReaction
    {
        public int Id { get; set; }
        public byte ReactionIndex { get; set; }
        public DateTime ReactedAt { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [ForeignKey("Track")]
        public int TrackId { get; set; }
        public User? User { get; set; }
        public Track? Track { get; set; }
    }
}
