using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class TrackArtist_VM
    {
        [Required(ErrorMessage = "Initial track info is required")]
        public int Id { get; set; }
        [Required(ErrorMessage = "At lease one featuring artist is required for this")]
        public List<int>? FeaturingArtists { get; set; }
    }
}
