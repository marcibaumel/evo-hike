using evoHike.Backend;
using evoHike.Backend.Middleware;
using evoHike.Backend.Repositories;
using evoHike.Backend.DataAccess;
using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models.DTO;
using evoHike.Backend.Services;
using evoHike.Backend.Services.Interfaces;
using OpenMeteo;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new NetTopologySuite.IO.Converters.GeoJsonConverterFactory());

        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddHttpClient<WeatherService>();

builder.Services.AddApplicationCors(builder.Configuration);
builder.Services.AddApplicationSwagger();
builder.Services.AddApplicationDatabase(builder.Configuration);
builder.Services.AddScoped<IUserDataAccess, UserDataAccess>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddApplicationAuthentication(builder.Configuration); 

builder.Services.AddScoped<ITrailService, TrailService>();
builder.Services.AddScoped<ITrailsDataAccess, TrailsDataAccess>();
builder.Services.AddScoped<IPlannedHikeDataAccess, PlannedHikeDataAccess>();
builder.Services.AddScoped<IDataImportDataAccess, DataImportDataAccess>();
builder.Services.AddScoped<IPlannedHikeService, PlannedHikeService>();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddScoped<DataImportService>();
builder.Services.AddScoped<OpenMeteoClient>();

builder.Services.Configure<BrevoOptions>(
    builder.Configuration.GetSection(BrevoOptions.BrevoOptionKey));

var app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();
app.RegisterMiddlewares();
app.InitializeDatabase();
app.MapControllers();

app.Run();