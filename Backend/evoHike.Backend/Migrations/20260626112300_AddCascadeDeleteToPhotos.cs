using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace evoHike.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddCascadeDeleteToPhotos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrailPhotos_HikingTrails_HikingTrailEntityId",
                table: "TrailPhotos");

            migrationBuilder.DropIndex(
                name: "IX_TrailPhotos_HikingTrailEntityId",
                table: "TrailPhotos");

            migrationBuilder.DropColumn(
                name: "HikingTrailEntityId",
                table: "TrailPhotos");

            migrationBuilder.CreateIndex(
                name: "IX_TrailPhotos_HikingTrailId",
                table: "TrailPhotos",
                column: "HikingTrailId");

            migrationBuilder.AddForeignKey(
                name: "FK_TrailPhotos_HikingTrails_HikingTrailId",
                table: "TrailPhotos",
                column: "HikingTrailId",
                principalTable: "HikingTrails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrailPhotos_HikingTrails_HikingTrailId",
                table: "TrailPhotos");

            migrationBuilder.DropIndex(
                name: "IX_TrailPhotos_HikingTrailId",
                table: "TrailPhotos");

            migrationBuilder.AddColumn<int>(
                name: "HikingTrailEntityId",
                table: "TrailPhotos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrailPhotos_HikingTrailEntityId",
                table: "TrailPhotos",
                column: "HikingTrailEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_TrailPhotos_HikingTrails_HikingTrailEntityId",
                table: "TrailPhotos",
                column: "HikingTrailEntityId",
                principalTable: "HikingTrails",
                principalColumn: "Id");
        }
    }
}
