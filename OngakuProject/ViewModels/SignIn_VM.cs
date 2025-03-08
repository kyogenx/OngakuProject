using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class SignIn_VM
    {
        [Required(ErrorMessage = "Email address or username is required")]
        public string? Username { get; set; }
        [Required(ErrorMessage = "Password is required")]
        [DataType(DataType.Password)]
        public string? Password { get; set; }
    }
}
