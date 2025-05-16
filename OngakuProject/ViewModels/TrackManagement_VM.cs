using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class TrackManagement_VM
    {
        [Required(ErrorMessage = "Track information is requried")]
        public int Id { get; set; }
        [Required(ErrorMessage = "User information is required")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "Choose a playlist to add the track")]
        public int PlaylistId { get; set; }
    }
}
