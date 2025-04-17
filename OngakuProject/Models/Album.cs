using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class Album : Base
    {
        [MaxLength(150)]
        public string? Title { get; set; }
        [MaxLength(500)]
        public string? Description { get; set; }
        public int Popularity { get; set; }
        public string? CoverImageUrl { get; set; } //Regular version of cover image
        public string? ThumbnailUrl { get; set; } //Compressed version of cover image
        public DateTime? AddedAt { get; set; }
        public DateTime? ReleasedAt { get; set; }
        public DateTime? LastUpdatedAt { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User? User { get; set; }
        public List<Track>? Tracks { get; set; }
        public List<Disc>? Discs { get; set; }
        public List<MoodTag>? MoodTags { get; set; }
        public List<AlbumGenre>? AlbumGenres { get; set; }
        public List<UserPlaylist>? UserPlaylists { get; set; } = new List<UserPlaylist>();
        [NotMapped]
        public int SongsQty { get; set; }
    }
}
