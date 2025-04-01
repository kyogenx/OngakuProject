using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class UpdatePassword_VM
    {
        public string? Id { get; set; }
        [Required]
        public byte Type { get; set; }
        [Required]
        public string? AdditionalInfo { get; set; }
        [Required(ErrorMessage = "New password is required")]
        [DataType(DataType.Password)]
        [MinLength(8, ErrorMessage = "Your new password must contain at least 8 characters")]
        [MaxLength(32, ErrorMessage = "Your new password must contain no more than 32 characters")]
        public string? NewPassword { get; set; }
        [Required(ErrorMessage = "New password is required")]
        [DataType(DataType.Password)]
        [MinLength(8, ErrorMessage = "Your new password must contain at least 8 characters")]
        [MaxLength(32, ErrorMessage = "Your new password must contain no more than 32 characters")]
        [Compare("NewPassword", ErrorMessage = "Passwords are not equal")]
        public string? ConfirmPassword { get; set; }
    }
}
