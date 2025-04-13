using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class TrackCredits_VM
    {
        [Required(ErrorMessage = "Choose the track to assign credits")]
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
        [Required(ErrorMessage = "Main artist information is required and cannot be ignored")]
        public int? MainArtistId { get; set; }
        public int? AlbumId { get; set; }
        public int? LabelId { get; set; }
        public int? LyricsId { get; set; }
    }
}
