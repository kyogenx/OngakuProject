using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.ViewModels
{
    public class Album_VM
    {
        public int Id { get; set; }
        [MinLength(12, ErrorMessage = "ISRC code must be 12 digits")]
        [MaxLength(12, ErrorMessage = "ISRC code must be 12 digits")]
        public string? ISRC_Code { get; set; }
        [MaxLength(13, ErrorMessage = "UPC code must be 12 or 13 digits"), MinLength(12)]
        [RegularExpression(@"^\d{12,13}$", ErrorMessage = "UPC code must be 12 or 13 digits")]
        public string? UPC_Code { get; set; }
        [Required(ErrorMessage = "Album title is required")]
        [MinLength(1, ErrorMessage = "Title must be at least 1 character long")]
        [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
        [RegularExpression(@"^[^\[\]\|<>\/\\]*$", ErrorMessage = "Album title cannot contain prohibited characters like [], |, <, >, /, or \\.")]
        public string? Title { get; set; }
        [MaxLength(1500, ErrorMessage = "Description cannot exceed 1500 characters")]
        public string? Description { get; set; }
        [DataType(DataType.ImageUrl)]
        public IFormFile? CoverImageFile { get; set; }
        public string? CoverImage { get; set; }
        //0 - Regular; 1 - Deluxe; 2 - Remastered; 3
        public byte Version { get; set; } 
        public bool IsExplicit { get; set; }
        public DateTime PremieredAt { get; set; }
        //Actual time of creation
        public DateTime CreatedAt { get; set; }
        [Required(ErrorMessage = "Genre is required")]
        public int GenreId { get; set; }
        [Required(ErrorMessage = "Author information is required")]
        public int UserId { get; set; }
    }
}
