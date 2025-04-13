using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class TrackGenre_VM
    {
        [Required(ErrorMessage = "Initial track information is required")]
        public int Id { get; set; }
        [Required(ErrorMessage = "At least one genre is required")]
        public List<int>? Genres { get; set; }
    }
}
