using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _03072025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TrackComments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(1500)", maxLength: 1500, nullable: true),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TrackId = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrackComments_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrackComments_Tracks_TrackId",
                        column: x => x.TrackId,
                        principalTable: "Tracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrackReaction",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReactionIndex = table.Column<byte>(type: "tinyint", nullable: false),
                    ReactedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TrackId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackReaction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrackReaction_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrackReaction_Tracks_TrackId",
                        column: x => x.TrackId,
                        principalTable: "Tracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrackCommentsReaction",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReactedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TrackCommentId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackCommentsReaction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrackCommentsReaction_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrackCommentsReaction_TrackComments_TrackCommentId",
                        column: x => x.TrackCommentId,
                        principalTable: "TrackComments",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TrackRecomments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(1500)", maxLength: 1500, nullable: true),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TrackCommentId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackRecomments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrackRecomments_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrackRecomments_TrackComments_TrackCommentId",
                        column: x => x.TrackCommentId,
                        principalTable: "TrackComments",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TrackRecommentReactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReactedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TrackRecommentId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackRecommentReactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrackRecommentReactions_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrackRecommentReactions_TrackRecomments_TrackRecommentId",
                        column: x => x.TrackRecommentId,
                        principalTable: "TrackRecomments",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_TrackComments_TrackId",
                table: "TrackComments",
                column: "TrackId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackComments_UserId",
                table: "TrackComments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackCommentsReaction_TrackCommentId",
                table: "TrackCommentsReaction",
                column: "TrackCommentId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackCommentsReaction_UserId",
                table: "TrackCommentsReaction",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackReaction_TrackId",
                table: "TrackReaction",
                column: "TrackId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackReaction_UserId",
                table: "TrackReaction",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackRecommentReactions_TrackRecommentId",
                table: "TrackRecommentReactions",
                column: "TrackRecommentId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackRecommentReactions_UserId",
                table: "TrackRecommentReactions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackRecomments_TrackCommentId",
                table: "TrackRecomments",
                column: "TrackCommentId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackRecomments_UserId",
                table: "TrackRecomments",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TrackCommentsReaction");

            migrationBuilder.DropTable(
                name: "TrackReaction");

            migrationBuilder.DropTable(
                name: "TrackRecommentReactions");

            migrationBuilder.DropTable(
                name: "TrackRecomments");

            migrationBuilder.DropTable(
                name: "TrackComments");
        }
    }
}
