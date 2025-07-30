using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _29072025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PollComments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(750)", maxLength: 750, nullable: true),
                    IsEdited = table.Column<bool>(type: "bit", nullable: false),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PollId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PollComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PollComments_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PollComments_Polls_PollId",
                        column: x => x.PollId,
                        principalTable: "Polls",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PollRecomments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsEdited = table.Column<bool>(type: "bit", nullable: false),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PollCommentId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PollRecomments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PollRecomments_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PollRecomments_PollComments_PollCommentId",
                        column: x => x.PollCommentId,
                        principalTable: "PollComments",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_PollComments_PollId",
                table: "PollComments",
                column: "PollId");

            migrationBuilder.CreateIndex(
                name: "IX_PollComments_UserId",
                table: "PollComments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PollRecomments_PollCommentId",
                table: "PollRecomments",
                column: "PollCommentId");

            migrationBuilder.CreateIndex(
                name: "IX_PollRecomments_UserId",
                table: "PollRecomments",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PollRecomments");

            migrationBuilder.DropTable(
                name: "PollComments");
        }
    }
}
