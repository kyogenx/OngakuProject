using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class TrackCredit
    {
        public int Id { get; set; }
        public string? Composer { get; set; }
        public string? Lyricist { get; set; }
        public string? Producer { get; set; }
        public string? Arranger { get; set; }
        public string? MainVocalist { get; set; }
        public string? FeaturedArtists { get; set; }
        public string? Instrumentalist { get; set; }
        public string? MixingEngineer { get; set; }
        public string? MasteringEngineer { get; set; }
        public string? RecordingEngineer { get; set; }
        public string? SoundDesigner { get; set; }
        [ForeignKey("Track")]
        public int? TrackId { get; set; }
        [ForeignKey("User")]
        public int MainArtistId { get; set; }
        public Track? Track { get; set; }
        public User? User { get; set; }
    }
}
