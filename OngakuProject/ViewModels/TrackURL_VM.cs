using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class TrackURL_VM
    {
        [Required(ErrorMessage = "Track initial info is required")]
        public int Id { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required(ErrorMessage = "Cover image url is required")]
        [DataType(DataType.ImageUrl)]
        public IFormFile? CoverImageUrl { get; set; }
    }
}
