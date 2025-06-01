using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class Lyrics : Base
    {
        public string? Content { get; set; }
        public string? Hints { get; set; }
        [MaxLength(45)]
        public string? SyncedLyricsId { get; set; }
        [ForeignKey("Track")]
        public int? TrackId { get; set; }
        [ForeignKey("Language")]
        public int LanguageId { get; set; }
        public Language? Language { get; set; }
        public Track? Track { get; set; }
    }
}
