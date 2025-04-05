using System.ComponentModel.DataAnnotations;

namespace OngakuProject.Models
{
    public class Country : Base
    {
        [MaxLength(90)]
        public string? Name { get; set; }
        [MaxLength(9)]
        public string? Shortname { get; set; }
        public int PhoneCode { get; set; }
        public List<User>? Users { get; set; }

    }
}
