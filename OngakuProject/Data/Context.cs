using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Models;

namespace OngakuProject.Data
{
    public class Context : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public Context(DbContextOptions<Context> Options) : base(Options) { }
        public DbSet<User> Users { get; set; }
    }
}
