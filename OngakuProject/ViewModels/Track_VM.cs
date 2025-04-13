using OngakuProject.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class Track_VM
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Track title is required")]
        [MaxLength(90, ErrorMessage = "Track title must not exceed 90 characters")]
        public string? Title { get; set; }
        [MaxLength(450, ErrorMessage = "Track description must not exceed 450 characters")]
        public string? Description { get; set; }
        [MaxLength(12)]
        public string? ISRC_Code { get; set; }
        public bool HasExplicit { get; set; }
        [Required(ErrorMessage = "Upload a valid audio or track file")]
        public IFormFile? TrackFileUrl { get; set; }
        public IFormFile? CoverImageUrl { get; set; } //Regular image url
        public IFormFile? ThumbnailUrl { get; set; } //Compressed image url
        public int Popularity { get; set; } //0 to 100; Used for recommendations
        public int Tempo { get; set; } //BPM
        public bool Mode { get; set; } //0 - minor; 1 - major
        public int Key { get; set; } //Stats for recommendations
        public int StreamsQty { get; set; }
        public byte Status { get; set; } //0 - inactive; 1 - pending for submission; 2 - muted; 3 - active ([0-2] - inactive)
        [DataType(DataType.Date)]
        public DateTime? AddedAt { get; set; }
        [DataType(DataType.Date)]
        public DateTime? ReleasedAtDt { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime? LastUpdatedAt { get; set; }
        public int ReleaseDateDay { get; set; }
        public int ReleaseDateMonth { get; set; }
        public int ReleaseDateYear { get; set; }
        [Required(ErrorMessage = "At least one genre is required (max: 3)")]
        public List<int>? Genres { get; set; }
        public List<string?>? GenreNames { get; set; }
        public List<int>? FeaturingArtists { get; set; }
        //[Required(ErrorMessage = "Track uploads are permitted for valid users only")]
        public int? UserId { get; set; }
    }
}
