Before being able to run this project, the following tools need to be installed on your system:

    For Windows:
        .NET 9.0 and .NET 8.0
        SQL Server Management Studio (SMMS)
        SQL Server (Developer Edition)
        Visual Studio 2022/ Visual Studio Code

    For MacOS/Linux
        .NET 9.0 and .NET 8.0
        Docker with image of SQL Server Installed
        Visual Studio Code

    First install the required packages by right clicking on the EatMeOut.API, selected Open In Integrated Terminal and running the following commands:
        dotnet add package Microsoft.EntityFrameworkCore.SqlServer
        dotnet add package Microsoft.EntityFrameworkCore.Tools
        dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
        dotnet add package Swashbuckle.AspNetCore
        dotnet add package Microsoft.EntityFrameworkCore.Design
        dotnet add package Microsoft.AspNetCore.Cors

    Then, open SQL Server Management Studio and connect using Windows Authentication, Select encryption as optional and check Trust Server Certificate -> Connect

OR

If you are using MacOS/Linux:

Run Docker, make sure the SQL Server Image is installed and running. Create a new Microsoft SQL Server, username: sa and password: YourStrongPassword123 and click Finish.

    Go into Visual Studio 2022/Vistual Studio Code -> Right click EatMeOut.API folder, open integrated terminal then run the following commands:
        dotnet build
        dotnet ef database update
        dotnet run

    Go into EatMeOut.API and open appsettings.json and make sure the Default Connection string is:

    Server=localhost;Database=EatMeOutDB;Trusted_Connection=True;TrustServerCertificate=True

OR

If you are using MacOS/Linux:

Server=localhost,1433;Database=EatMeOutDB;User Id=admin;Password=Password123#;TrustServerCertificate=True

    Open integrated terminal by right clicking on the frontend folder and run:

    npx http-server -p 8080

    Open your browser and navigate to http://127.0.0.1:8080

    212121