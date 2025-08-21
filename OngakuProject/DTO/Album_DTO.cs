using OngakuProject.Models;

namespace OngakuProject.DTO
{
    public class Album_DTO
    {
        public int Id { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Genre { get; set; }
        public bool IsExplicit { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PremieredAt { get; set; }
        public byte Status { get; set; }
        public int SongsQty { get; set; }
        public int UserId { get; set; }
        public int GenreId { get; set; }
        public byte Version { get; set; }
        public string? MainArtist { get; set; }
        public List<User>? Artists { get; set; }
        public List<Track>? Tracks { get; set; }
    }
}
