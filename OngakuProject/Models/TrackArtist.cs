using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class TrackArtist : Base
    {
        [ForeignKey("Track")]
        public int TrackId { get; set; }
        [ForeignKey("Artist")]
        public int ArtistId { get; set; }
        public Track? Track { get; set; }
        public User? User { get; set; } 
    }
}
