using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class TrackStream_VM
    {
        [Required(ErrorMessage = "Track information is required")]
        public int Id { get; set; }
        [Required(ErrorMessage = "User information is required")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "Track duration is required")]
        public int Duration { get; set; }
        public byte DeviceType { get; set; }
        public bool IsValidStream { get; set; }
        public DateTime? ListenedAt { get; set; }
    }
}
