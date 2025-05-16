using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class TrackHistory
    {
        public int Id { get; set; }
        public int Duration { get; set; } //Playtime duration; Log after 25%+ 
        public bool IsValid { get; set; }
        public byte DeviceType { get; set; } //0 - Web; 1 - PC/Laptop/Mac; 2 - Mobile/Tablet
        public DateTime ListenedAt { get; set; }
        [ForeignKey("Track")]
        public int TrackId { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public Track? Track { get; set; }
        public User? User { get; set; }
    }
}
