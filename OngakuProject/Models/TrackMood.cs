using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class TrackMood : Base
    {
        [ForeignKey("Track")]
        public int TrackId { get; set; }
        [ForeignKey("MoodTag")]
        public int MoodTagId { get; set; }
        public Track? Track { get; set; }
        public MoodTag? MoodTag { get; set; }
    }
}
