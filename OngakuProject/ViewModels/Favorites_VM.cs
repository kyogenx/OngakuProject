using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class Favorites_VM
    {
        public int Id { get; set; }
        public DateTime? AddedAt { get; set; }
        public int Order { get; set; }
        [Required(ErrorMessage = "Choose a track to add to favorites")]
        public int TrackId { get; set; }
        [Required(ErrorMessage = "User information is required")]
        public int UserId { get; set; }
    }
}
