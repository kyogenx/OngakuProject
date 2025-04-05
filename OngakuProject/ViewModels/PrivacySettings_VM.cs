using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class PrivacySettings_VM
    {
        [Required(ErrorMessage = "User's Id is required")]
        public int Id { get; set; }
        public byte WhoCanChat { get; set; } //0 - everyone; 1 - only subscribers; 2 - chosen members; 3 - no one;
        public byte WhoCanDownload { get; set; }
        public byte WhoCanSeeLastSeenInfo { get; set; }
        public bool IsVisible { get; set; }
    }
}
