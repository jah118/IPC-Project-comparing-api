using System.Text;
using DataAccess;
using DataAccess.Model;
using DataAccess.Repo.Interface;

using Microsoft.EntityFrameworkCore;

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
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddTransient<IRepository<User>, UserRepo>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// app.Urls.Add("http://0.0.0.0:3000");

const string helloWorldPayload = "Hello, World!";


var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
       new WeatherForecast
       (
           DateTime.Now.AddDays(index),
           Random.Shared.Next(-20, 55),
           summaries[Random.Shared.Next(summaries.Length)]
       ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

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

app.MapGet("/usersefcore", async (IRepository<User> userRepo) => await userRepo.GetAll()).WithName("UserEfCore");
app.MapGet("/usersefcoreGetById", (int id, IRepository<User> userRepo) => userRepo.GetById(id));
app.MapGet("/hello", () => "Hello World!");
app.MapGet("/plain", () =>
    {
    Results.StatusCode(200);
    Results.Content("text/plain");
    return Results.Text(helloWorldPayload);
    });

app.Run();

internal record WeatherForecast(DateTime Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}