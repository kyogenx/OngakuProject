using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class UserPlaylist
    {
        public int Id { get; set; }
        public byte PinOrder { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? SavedAt { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [ForeignKey("Album")]
        public int? AlbumId { get; set; }
        [ForeignKey("Playlist")]
        public int? PlaylistId { get; set; }
        public User? User { get; set; }
        public Album? Album { get; set; }
        public Playlist? Playlist { get; set; }
        [NotMapped]
        public bool IsTrackInPlaylist { get; set; }
    }
}
