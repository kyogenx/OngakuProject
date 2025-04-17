using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class Favorite : Base
    {
        public int Order { get; set; }
        public DateTime? AddedAt { get; set; }
        [ForeignKey("Track")]
        public int TrackId { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public Track? Track { get; set; }
        public User? User { get; set; }
    }
}
