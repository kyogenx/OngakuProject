using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class TrackRaven
    {
        public string? Id { get; set; }
        public int LegacyDb_TrackId { get; set; }
        [MaxLength(90)]
        public string? Title { get; set; }
        [MaxLength(450)]
        public string? Description { get; set; }
        public int LyricsId { get; set; }
        public List<LyricSync>? SyncedLyrics { get; set; }
    }
}
