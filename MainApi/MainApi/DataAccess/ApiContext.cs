using Bogus;
using MainApi.DataAccess.Model;
using Microsoft.EntityFrameworkCore;

namespace MainApi.DataAccess
{
    public class ApiContext : DbContext
    {
        public ApiContext()
        {
        }

        public ApiContext(DbContextOptions<ApiContext> options) : base(options)
        {
        }

        private const string connectionString =
        "Server=127.0.0.1,1443; Initial Catalog=EFCore; User Id=SA;Password=VerySecretPass1234; Integrated Security=False; MultipleActiveResultSets=True;";
        //"Server=10.10.1.62,1433; Database=EFCore; User Id=sa;Password=12341234;MultipleActiveResultSets=true";
        //"Server=sqlserver;Database=EFCore;User Id=sa;Password=BigPassw0rd";

        //private const string connectionString = "Server=JonasXPS\\SQLEXPRESS; Initial Catalog=EFCore; Integrated Security=True";

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer(connectionString);
        //}

        public DbSet<User> Users { get; set; } = null!;

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

            // generate 1000 items
            modelBuilder
                .Entity<User>()
                .HasData(testUsers.GenerateBetween(1000, 1000));
        }
    }
}