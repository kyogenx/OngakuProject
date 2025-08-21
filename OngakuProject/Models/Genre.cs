namespace OngakuProject.Models
{
    public class Genre : Base
    {
        public string? Name { get; set; }
        public int Popularity { get; set; }
        public List<User>? Users { get; set; } = new List<User>();
        public List<Track>? Tracks { get; set; } = new List<Track>();
        public List<Album>? Albums { get; set; } = new List<Album>();
    }
}
