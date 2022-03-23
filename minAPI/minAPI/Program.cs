using System.Diagnostics;
using System.Text;
using Microsoft.EntityFrameworkCore;
using minAPI.DataAccess;
using minAPI.DataAccess.Model;
using minAPI.DataAccess.Repo.Interface;

var builder = WebApplication.CreateBuilder(args);

IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
configurationBuilder.SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", false, true)
    .Build();

var configuration = configurationBuilder.Build();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApiContext>(options =>
{
    options.UseSqlServer("Server=miniapidb; Initial Catalog=EFCore; User Id=SA;Password=VerySecretPass1234; Integrated Security=False; MultipleActiveResultSets=True;");

    //options.UseSqlServer("Server=JONASXPS\\SQLEXPRESS; Initial Catalog=EFCore; Integrated Security=True");
});

builder.Services.AddTransient<IRepository<User>, UserRepo>();
using (var service = builder.Services.BuildServiceProvider().GetService<ApiContext>())
{
    Debug.Assert(service != null, nameof(service) + " != null");
    service.Database.EnsureCreated();
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

const string helloWorldPayload = "Hello, World!";


app.MapGet("/users", () =>
{
    var list = new List<User>(1000);
    for (int index = 1; index < 1001; index++)
    {
        list.Add(new User
        {
            Id = index,
            Age = 25,
            FirstName = "First_Name" + index,
            LastName = "Last_Name" + index,
            Email = "Email" + index,
            Framework = "minimal"
        }
        );
    }

    return list;
}).WithName("User");

app.MapGet("/getEfCore", async (IRepository<User> userRepo) => await userRepo.GetAll()).WithName("UserEfCore");
app.MapGet("/getEfCoreById", (int id, IRepository<User> userRepo) => userRepo.GetById(id));
app.MapGet("/hello", () => "Hello World!");
app.MapGet("/plain", () =>
    {
        Results.StatusCode(200);
        Results.Content("text/plain");
        return Results.Text(helloWorldPayload);
    });

app.Run();
