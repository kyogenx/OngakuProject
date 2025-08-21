using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class AlbumTrack
    {
        public int Id { get; set; }
        [ForeignKey("Track")]
        public int TrackId { get; set; }
        [ForeignKey("Album")]
        public int AlbumId { get; set; }
        public int TrackOrderNumber { get; set; }
        public bool IsDeleted { get; set; }
        public Track? Track { get; set; }
        public Album? Album { get; set; }

    }
}
