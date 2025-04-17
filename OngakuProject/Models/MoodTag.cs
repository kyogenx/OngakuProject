using System.ComponentModel.DataAnnotations;

namespace OngakuProject.Models
{
    public class MoodTag : Base
    {
        [MaxLength(75)]
        public string? Name { get; set; }
        public List<Track>? Tracks { get; set; } = new List<Track>();
    }
}
