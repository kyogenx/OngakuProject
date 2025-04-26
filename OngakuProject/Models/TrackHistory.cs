using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class TrackHistory
    {
        public int Id { get; set; }
        public bool IsListened { get; set; } = true;
        public DateTime ListenedAt { get; set; }
        [ForeignKey("Track")]
        public int TrackId { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public Track? Track { get; set; }
        public User? User { get; set; }
    }
}
