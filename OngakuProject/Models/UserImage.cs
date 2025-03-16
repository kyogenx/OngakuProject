using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class UserImage
    {
        public int Id { get; set; }
        public string? ImgUrl { get; set; }
        public bool IsDeleted { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
