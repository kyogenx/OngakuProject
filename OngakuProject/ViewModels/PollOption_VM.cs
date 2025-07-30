using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class PollOption_VM
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Poll option is required")]
        [MaxLength(45, ErrorMessage = "Poll option can't contain more than 45 characters")]
        public string? Option { get; set; }
        [Required(ErrorMessage = "Poll information is required")]
        public int? PollId { get; set; }
    }
}
