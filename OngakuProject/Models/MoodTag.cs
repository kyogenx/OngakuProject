using System.ComponentModel.DataAnnotations;

namespace OngakuProject.Models
{
    public class MoodTag : Base
    {
        [MaxLength(75)]
        public string? Name { get; set; }
        public List<TrackMood>? TrackMoods { get; set; }
    }
}
