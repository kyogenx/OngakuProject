using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class TrackManagement_VM
    {
        [Required(ErrorMessage = "Track information is requried")]
        public int Id { get; set; }
        [Required(ErrorMessage = "User information is required")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "Choose at least one playlist")]
        public List<int?>? PlaylistIds { get; set; }
    }
}
