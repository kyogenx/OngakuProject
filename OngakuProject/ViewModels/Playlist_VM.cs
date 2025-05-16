using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class Playlist_VM
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Playlist name is required")]
        [MaxLength(90, ErrorMessage = "Playlist's title cannot contain more than 90 characters")]
        public string? Title { get; set; }
        [MinLength(3, ErrorMessage = "Playlist's shortname must contain from 3 to 15 characters [3-15]")]
        [MaxLength(15, ErrorMessage = "Playlist's shortname cannot contain more than 15 characters")]
        public string? Shortname { get; set; }
        [DataType(DataType.ImageUrl)]
        public IFormFile? ImageUrl { get; set; }
        [MaxLength(360, ErrorMessage = "Playlist's description cannot contain more than 360 characers")]
        public string? Description { get; set; }
        public byte PrivacyStatus { get; set; } = 2;
        public bool IsEditable { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime? CreatedAt { get; set; }
        [Required(ErrorMessage = "User information is required")]
        public int UserId { get; set; }
        public string? ImgUrl { get; set; }
    }
}
