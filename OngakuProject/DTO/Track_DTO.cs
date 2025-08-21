using OngakuProject.Models;

namespace OngakuProject.DTO
{
    public class Track_DTO
    {
        public int Id { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Title { get; set; }
        public string? ArtistName { get; set; }
        public string? AudioUrl { get; set; }
        public bool HasExplicit { get; set; }
        public int? UserId { get; set; }
        public int? AlbumId { get; set; }
        public bool IsStarred { get; set; }
        public bool IsIncluded { get; set; }
        public List<TrackArtist>? FeaturingArtists { get; set; }

    }
}
