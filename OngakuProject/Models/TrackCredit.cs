using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class TrackCredit
    {
        public int Id { get; set; }
        [MaxLength(250)]
        public string? Composer { get; set; }
        [MaxLength(250)]
        public string? Lyricist { get; set; }
        [MaxLength(250)]
        public string? Producer { get; set; }
        [MaxLength(250)]
        public string? Arranger { get; set; }
        [MaxLength(250)]
        public string? MainVocalist { get; set; }
        [MaxLength(250)]
        public string? FeaturedArtists { get; set; }
        [MaxLength(250)]
        public string? Instrumentalist { get; set; }
        [MaxLength(250)]
        public string? MixingEngineer { get; set; }
        [MaxLength(250)]
        public string? MasteringEngineer { get; set; }
        [MaxLength(250)]
        public string? RecordingEngineer { get; set; }
        [MaxLength(250)]
        public string? SoundDesigner { get; set; }
        [ForeignKey("Track")]
        public int? TrackId { get; set; }
        [ForeignKey("User")]
        public int MainArtistId { get; set; }
        public Track? Track { get; set; }
        public User? User { get; set; }
    }
}
