namespace OngakuProject.Models
{
    public class Language
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? LanguageCode { get; set; }
        public List<Lyrics>? Lyrics { get; set; }
    }
}
