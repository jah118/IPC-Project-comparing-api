using Bogus;
using DataAccess.Model;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class ApiContext : DbContext
    {
        public ApiContext()
        {
        }

        public ApiContext(DbContextOptions options)
        {
        }

        private const string connectionString = "Server=JONASXPS\\SQLEXPRESS; Initial Catalog=EFCore; Integrated Security=True";

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(connectionString);
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            var ids = 1;
            var testUsers = new Faker<User>()
                .RuleFor(m => m.Gender, f => f.PickRandom<Gender>())

                .RuleFor(m => m.Id, f => ids++)
                .RuleFor(m => m.FirstName, f => f.Person.FirstName)
                .RuleFor(m => m.LastName, f => f.Person.LastName)
                .RuleFor(m => m.Age, f => f.Random.Number(8, 90))
                .RuleFor(m => m.Framework, f => "DB")
                .RuleFor(m => m.Email, f => f.Person.Email)
                .FinishWith((f, u) =>
                {
                    Console.WriteLine("User Created! Id={0}", u.Id);
                });


            // generate 10000 items
            modelBuilder
                .Entity<User>()
                .HasData(testUsers.GenerateBetween(10000, 10000));
        }
    }
}
