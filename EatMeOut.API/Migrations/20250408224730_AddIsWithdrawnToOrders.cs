using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EatMeOut.Migrations
{
    /// <inheritdoc />
    public partial class AddIsWithdrawnToOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsWithdrawn",
                table: "Orders",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsWithdrawn",
                table: "Orders");
        }
    }
}
