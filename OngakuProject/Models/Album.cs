using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class Album : Base
    {
        [MinLength(12)]
        [MaxLength(12)]
        public string? UPC_Code { get; set; }
        [MaxLength(100)]
        public string? Title { get; set; }
        [MaxLength(1500)]
        public string? Description { get; set; }
        public int Popularity { get; set; }
        public string? CoverImageUrl { get; set; } //Regular version of cover image
        public string? ThumbnailUrl { get; set; } //Compressed version of cover image
        public byte Version { get; set; }   //0 - Regular; 1 - Deluxe; 2 - Remastered; 3
        public bool IsExplicit { get; set; }
        public byte Status { get; set; } //0 - Passive; 1 - Pending; 2 - Active;
        public DateTime? AddedAt { get; set; }
        public DateTime? PremieredAt { get; set; }
        public DateTime? LastUpdatedAt { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [ForeignKey("Genre")]
        public int GenreId { get; set; }
        public User? User { get; set; }
        public Genre? Genre { get; set; }
        public List<Disc>? Discs { get; set; }
        public List<MoodTag>? MoodTags { get; set; }
        public List<UserPlaylist>? UserPlaylists { get; set; } = new List<UserPlaylist>();
        public List<AlbumTrack>? AlbumTracks { get; set; } = new List<AlbumTrack>();
        [NotMapped]
        public int SongsQty { get; set; }
    }
}
