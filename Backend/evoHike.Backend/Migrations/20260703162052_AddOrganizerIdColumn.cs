using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace evoHike.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddOrganizerIdColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrganizerId",
                table: "PlannedHikes",
                type: "int",
                nullable: false,
                defaultValue: 0);
            /*
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });
             */

            migrationBuilder.CreateTable(
                name: "HikeParticipants",
                columns: table => new
                {
                    PlannedHikeId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HikeParticipants", x => new { x.PlannedHikeId, x.UserId });
                    table.ForeignKey(
                        name: "FK_HikeParticipants_PlannedHikes_PlannedHikeId",
                        column: x => x.PlannedHikeId,
                        principalTable: "PlannedHikes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HikeParticipants_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlannedHikes_OrganizerId",
                table: "PlannedHikes",
                column: "OrganizerId");

            migrationBuilder.CreateIndex(
                name: "IX_HikeParticipants_UserId",
                table: "HikeParticipants",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PlannedHikes_Users_OrganizerId",
                table: "PlannedHikes",
                column: "OrganizerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlannedHikes_Users_OrganizerId",
                table: "PlannedHikes");

            migrationBuilder.DropTable(
                name: "HikeParticipants");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropIndex(
                name: "IX_PlannedHikes_OrganizerId",
                table: "PlannedHikes");

            migrationBuilder.DropColumn(
                name: "OrganizerId",
                table: "PlannedHikes");
        }
    }
}
