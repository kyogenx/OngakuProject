using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class TrackPlaylist
    {
        public int Id { get; set; }
        public int Order { get; set; }
        public bool IsDeleted { get; set; }
        [ForeignKey("Playlist")]
        public int PlaylistId { get; set; }
        [ForeignKey("Track")]
        public int TrackId { get; set; }
        public DateTime? AddedAt { get; set; }
        public Track? Track { get; set; }
        public Playlist? Playlist { get; set; }
    }
}
