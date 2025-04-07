namespace OngakuProject.Models
{
    public class MoodTag : Base
    {
        public string? Name { get; set; }
        public List<TrackMood>? TrackMoods { get; set; }
    }
}
