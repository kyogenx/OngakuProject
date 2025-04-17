using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class TrackArtist : Base
    {
        [ForeignKey("Track")]
        public int TrackId { get; set; }
        [ForeignKey("User")]
        public int ArtistId { get; set; }
        public Track? Track { get; set; }
        public User? User { get; set; }
        [NotMapped]
        public string? ArtistName { get; set; }

        public static implicit operator List<object>(TrackArtist v)
        {
            throw new NotImplementedException();
        }
    }
}
