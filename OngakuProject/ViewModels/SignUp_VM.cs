using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class SignUp_VM
    {
        [Required(ErrorMessage = "Email address is required")]
        [DataType(DataType.EmailAddress)]
        public string? Email { get; set; }
        [Required(ErrorMessage = "Password is required")]
        [DataType(DataType.Password)]
        public string? Password { get; set; }
        [Required(ErrorMessage = "Confirm your password, please")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Passwords are not equal")]
        public string? ConfirmPassword { get; set; }    
    }
}
