using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class Lyrics : Base
    {
        public string? Content { get; set; }
        public string? Hints { get; set; }
        [ForeignKey("Track")]
        public int? TrackId { get; set; }
        [ForeignKey("Language")]
        public int LanguageId { get; set; }
        public Language? Language { get; set; }
        public Track? Track { get; set; }
    }
}
