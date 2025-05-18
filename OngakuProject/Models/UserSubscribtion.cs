using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class UserSubscribtion
    {
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public int SubscriberId { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime SubscribedFrom { get; set; }
        public User? User { get; set; }
        
    }
}
