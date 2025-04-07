namespace OngakuProject.Models
{
    public class Lyrics : Base
    {
        public string? Content { get; set; }
        public string? Language { get; set; }
        public List<Track>? Tracks { get; set; }
    }
}
