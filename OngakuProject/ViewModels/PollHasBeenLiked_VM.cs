namespace OngakuProject.ViewModels
{
    public class PollHasBeenLiked_VM
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int PollId { get; set; }
        public DateTime? LikedAt { get; set; }
    }
}
