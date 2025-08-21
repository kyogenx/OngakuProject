using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class AlbumMetadata_VM
    {
        [Required(ErrorMessage = "Album information is required")]
        public int Id { get; set; }
        [Required(ErrorMessage = "Album title is required")]
        [MinLength(1, ErrorMessage = "Title must be at least 1 character long")]
        [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
        [RegularExpression(@"^[^\[\]\|<>\/\\]*$", ErrorMessage = "Album title cannot contain prohibited characters like [], |, <, >, /, or \\.")]
        public string? Title { get; set; }
        [MaxLength(1500, ErrorMessage = "Description cannot exceed 1500 characters")]
        public string? Description { get; set; }
        [DataType(DataType.ImageUrl)]
        public IFormFile? CoverImageFile { get; set; }
        [Required(ErrorMessage = "User info is required")]
        public int UserId { get; set; }
        public bool IsExplicit { get; set; }
    }
}
