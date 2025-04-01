using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class PasscodeLock_VM
    {
        public int Id { get; set; }
        [MaxLength(12, ErrorMessage = "Passcode cannot contain more than 12 characters")]
        public string? Passcode { get; set; }
        public string? CurrentPasscode { get; set; }
    }
}
