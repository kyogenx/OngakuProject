using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class RePost : Base
    {
        [MaxLength(1500)]
        public string? Reply { get; set; }
        public bool IsEdited { get; set; }
        public DateTime CreatedAt { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [ForeignKey("Post")]
        public int? PostId { get; set; }
        public User? User { get; set; }
        public Post? Post { get; set; }
    }
}
