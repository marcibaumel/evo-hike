using evoHike.Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using evoHike.Backend.Models;

namespace evoHike.Backend;

public static class Configs
{
    public const string CorsPolicyName = "_myAllowSpecificOrigins";

    public static void AddApplicationCors(this IServiceCollection services, IConfiguration configuration)
    {
        var allowedOrigins = configuration.GetValue<string>("AllowedOrigins");

        services.AddCors(options =>
        {
            options.AddPolicy(name: CorsPolicyName,
                policy =>
                {
                    if (allowedOrigins == "*")
                    {
                        policy.AllowAnyOrigin()
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    }
                    else if (!string.IsNullOrWhiteSpace(allowedOrigins))
                    {
                        policy.WithOrigins(allowedOrigins.Split(";", StringSplitOptions.RemoveEmptyEntries))
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    }
                });
        });
    }

    public static void AddApplicationSwagger(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            var xmlFilename = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
            options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "bearer"
            });

            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });
    }

    public static void AddApplicationDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var useInMemory = configuration.GetValue<bool>("UseInMemoryDatabase");

        if (useInMemory)
        {
            services.AddDbContext<EvoHikeContext>(options =>
                options.UseInMemoryDatabase("TestDatabase"));
        }
        else
        {
            services.AddDbContext<EvoHikeContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                    x => x.UseNetTopologySuite()));
        }
    }
    public static void RegisterMiddlewares(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseCors(CorsPolicyName);

        app.UseAuthentication(); 
        app.UseAuthorization();

        app.MapControllers();
    }
    public static void InitializeDatabase(this WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            var context = services.GetRequiredService<EvoHikeContext>();

            DbInitializer.Initialize(context);
        }
    }
    
    public static void AddApplicationAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = new JwtSettings();
        configuration.GetSection(JwtSettings.SectionName).Bind(jwtSettings);

        if (string.IsNullOrEmpty(jwtSettings.Key) || jwtSettings.Key == "REPLACE_WITH_SECURE_SECRET_KEY")
        {
            throw new InvalidOperationException("JWT Key is missing or using placeholder! Update your appsettings.Development.json.");
        }

        var key = Encoding.UTF8.GetBytes(jwtSettings.Key);

        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
            
                    ValidateIssuer = false,
                    ValidateAudience = false,
            
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

        services.AddAuthorization();
    }
}