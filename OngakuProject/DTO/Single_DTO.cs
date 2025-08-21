using OngakuProject.Models;

namespace OngakuProject.DTO
{
    public class Single_DTO
    {
        public int Id { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public bool IsExplicit { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime PremieredAt { get; set; }
        public byte Status { get; set; }
        public int UserId { get; set; }
        public string? MainArtist { get; set; }
        public List<User>? Artists { get; set; }
    }
}
