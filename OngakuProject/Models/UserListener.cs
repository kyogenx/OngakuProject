using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class UserListener
    {
        public int Id { get; set; }
        [ForeignKey("User")]
        public int ArtistId { get; set; }
        public int UserId { get; set; }
        public bool IsActive { get; set; }
        public DateTime LastListenedAt { get; set; }
        public User? User { get; set; }
    }
}
