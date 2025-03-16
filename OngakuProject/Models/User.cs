using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class User : IdentityUser<int>
    {
        [MaxLength(75)]
        public string? Nickname { get; set; }
        [MaxLength(15)]
        public string? Searchname { get; set; }
        [MaxLength(2500)]
        public string? Description { get; set; }
        public List<UserImage>? UserImages { get; set; }
        [NotMapped]
        public string? ImgUrl { get; set; }
    }
}
