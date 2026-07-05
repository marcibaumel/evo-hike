using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

namespace evoHike.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddControlPointsToTrail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Point>(
                name: "EndPoint",
                table: "HikingTrails",
                type: "geography",
                nullable: true);

            migrationBuilder.AddColumn<Point>(
                name: "StartPoint",
                table: "HikingTrails",
                type: "geography",
                nullable: true);

            migrationBuilder.AddColumn<MultiPoint>(
                name: "Waypoints",
                table: "HikingTrails",
                type: "geography",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndPoint",
                table: "HikingTrails");

            migrationBuilder.DropColumn(
                name: "StartPoint",
                table: "HikingTrails");

            migrationBuilder.DropColumn(
                name: "Waypoints",
                table: "HikingTrails");
        }
    }
}
