using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class Track : Base
    {
        [MaxLength(90)]
        public string? Title { get; set; }
        [MaxLength(450)]
        public string? Description { get; set; }
        [MaxLength(12)]
        public string? ISRC_Code { get; set; }
        public bool HasExplicit { get; set; }
        public string? TrackFileUrl { get; set; }
        public string? CoverImageUrl { get; set; } //Regular image url
        public string? ThumbnailUrl { get; set; } //Compressed image url
        public int Popularity { get; set; } //0 to 100; Used for recommendations
        public int Tempo { get; set; } //BPM
        public bool Mode { get; set; } //0 - minor; 1 - major
        public int Key { get; set; } //Stats for recommendations
        public byte Status { get; set; }
        public DateTime? AddedAt { get; set; }
        public DateTime? ReleasedAt { get; set; }
        public DateTime? LastUpdatedAt { get; set; }
        [ForeignKey("User")]
        public int? UserId { get; set; }
        [ForeignKey("Album")]
        public int? AlbumId { get; set; }
        [ForeignKey("Label")]
        public int? LabelId { get; set; }
        [ForeignKey("Lyrics")]
        public int? LyricsId { get; set; }
        [ForeignKey("TrackCredit")]
        public int? CreditId { get; set; }
        public User? User { get; set; }
        public Album? Album { get; set; }
        public TrackCredit? TrackCredit { get; set; }
        public Label? Label { get; set; }
        public Lyrics? Lyrics { get; set; }
        public List<Genre>? Genres { get; set; } = new List<Genre>();
        public List<MoodTag>? MoodTags { get; set; } = new List<MoodTag>();
        public List<TrackPlaylist>? TrackPlaylists { get; set; } = new List<TrackPlaylist>();
        public List<TrackReaction>? TrackReactions { get; set; } = new List<TrackReaction>();

        public List<TrackComment>? TrackComments { get; set; } = new List<TrackComment>();
        public List<TrackArtist>? TrackArtists { get; set; }
        public List<TrackHistory>? TrackHistory { get; set; }
        public List<DailyStreamAggregation>? DailyStreamAggregations { get; set; }
        public List<Favorite>? Favorite { get; set; }
        [NotMapped]
        public int StreamsQty { get; set; }
        [NotMapped]
        public string? MainArtistName { get; set; }
        [NotMapped]
        public bool IsFavorite { get; set; }
    }
}
