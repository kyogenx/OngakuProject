using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class Playlist : Base
    {
        [Required(ErrorMessage = "Playlist title name is required")]
        [MaxLength(90, ErrorMessage = "Playlist's title can contain up to 90 characters")]
        public string? Name { get; set; }
        [MaxLength(15, ErrorMessage = "Shortname cannot be larger than 15 characters")]
        public string? Shortname { get; set; }
        [MaxLength(360, ErrorMessage = "Playlist's description should contain up to 360 characters")]
        public string? Description { get; set; }
        [MaxLength(100)]
        public string? ImageUrl { get; set; }
        public byte PrivacyStatus { get; set; } = 2; //0 - Private; 1 - Only for subscribers; 2 - Public
        public DateTime? CreatedAt { get; set; }
        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User? User { get; set; }
        public List<UserPlaylist>? UserPlaylists { get; set; } = new List<UserPlaylist>();
        public List<TrackPlaylist>? TrackPlaylists { get; set; } = new List<TrackPlaylist>();

        [NotMapped]
        public int SongsQty { get; set; }
        [NotMapped]
        public int TrueId { get; set; }
    }
}
