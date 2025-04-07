using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class TrackGenre : Base
    {
        [ForeignKey("Track")]
        public int TrackId { get; set; }
        [ForeignKey("Genre")]
        public int GenreId { get; set; }
        public Track? Track { get; set; }
        public Genre? Genre { get; set; }
    }
}
