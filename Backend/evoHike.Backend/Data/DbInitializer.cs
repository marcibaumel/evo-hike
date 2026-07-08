using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite;
using NetTopologySuite.Geometries;

namespace evoHike.Backend.Data;

public static class DbInitializer
{
    public static void Initialize(EvoHikeContext context)
    {
        if (!context.Database.IsInMemory())
        {
            context.Database.EnsureDeleted();
            context.Database.Migrate();
        }
    }
}