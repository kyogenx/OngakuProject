using System.ComponentModel.DataAnnotations;

namespace OngakuProject.Models
{
    public class Label : Base
    {
        [MaxLength(150)]
        public string? Name { get; set; }
        [MaxLength(1050)]
        public string? Description { get; set; }
        public List<User>? Users { get; set; }
        public List<Track>? Tracks { get; set; }
        public List<Album>? Albums { get; set; }
    }
}
