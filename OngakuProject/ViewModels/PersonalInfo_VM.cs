using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class PersonalInfo_VM
    {
        [Required(ErrorMessage = "Provide valid Id to go on")]
        public int Id { get; set; }
        public string[]? RealName { get; set; }
        [MaxLength(350)]
        public string? WebpageLink { get; set; }
        public int? CountryId { get; set; }
    }
}
