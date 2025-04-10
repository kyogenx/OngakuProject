namespace OngakuProject.ViewModels
{
    public class GenreStats_VM
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int Popularity { get; set; }
        public int TracksQty { get; set; }
        public int MonthlyListenersQty { get; set; }
    }
}
