using MainApi.DataAccess;
using MainApi.DataAccess.Model;
using MainApi.DataAccess.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
configurationBuilder.SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", false, true)
    .Build();
var configuration = configurationBuilder.Build();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApiContext>(options =>
{
    options.UseSqlServer("Server=mainpidb; Initial Catalog=EFCore; User Id=SA;Password=VerySecretPass1234; Integrated Security=False;");
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

app.UseAuthorization();

app.MapControllers();

app.Run();