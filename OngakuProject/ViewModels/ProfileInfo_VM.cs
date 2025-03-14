using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class ProfileInfo_VM
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Nickname is required as your profile information")]
        [MaxLength(75, ErrorMessage = "Entered nickname is too long")]
        public string? Nickname { get; set; }
        [MaxLength(15, ErrorMessage = "Entered searchname is too long")]
        public string? Searchname { get; set; }
        [MaxLength(2500, ErrorMessage = "Entered description is too long (max 2500 characters)")]
        public string? Description { get; set; }
        public string? ImgUrl { get; set; }
    }
}
