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

    First install the required packages by right clicking on the TakeMeOut.API, selected Open In Integrated Terminal and running the following commands:
        dotnet add package Microsoft.EntityFrameworkCore.SqlServer
        dotnet add package Microsoft.EntityFrameworkCore.Tools
        dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
        dotnet add package Swashbuckle.AspNetCore
        dotnet add package Microsoft.EntityFrameworkCore.Design
        dotnet add package Microsoft.AspNetCore.Cors

    Then, open SQL Server Management Studio and connect using Windows Authentication, Select encryption as optional and check Trust Server Certificate -> Connect

If you are using Windows:

    Go into TakeMeOut.API and open appsettings.json and make sure the Default Connection string is:
    Server=localhost;Database=TakeMeOutDB;Trusted_Connection=True;TrustServerCertificate=True  

    Make sure you are connected to SQL server first.

    Open integrated terminal in TakeMeOut\TakeMeOut.API and run the following commands:
    
    dotnet ef migrations add InitialCreate (If this doesn't work, or the migration already exists, delete everything INSIDE TakeMeOut.API/Migrations. )
    dotnet ef database update
    dotnet build
    dotnet run

    This will setup your database.

    Open integrated terminal in TakeMeOut\frontend:

    npx http-server -p 8080 (or any other port)

    Open your browser and navigate to http://127.0.0.1:8080, use Ctrl + Shift + R to clear browser cache 

    
OR

If you are using MacOS/Linux:

Go into TakeMeOut.API and open appsettings.json and make sure the Default Connection string is:
Server=localhost,1433;Database=TakeMeOutDB;User Id=admin;Password=Password123#;TrustServerCertificate=True

Run Docker, make sure the SQL Server Image is installed and running. Create a new Microsoft SQL Server, username: sa and password: YourStrongPassword123 and click Finish.

    Open integrated terminal in TakeMeOut\TakeMeOut.API and run the following commands:
    
    dotnet ef migrations add InitialCreate If this doesn't work, or the migration already exists, delete everything INSIDE TakeMeOut.API/Migrations. )
    dotnet ef database update
    dotnet build
    dotnet run

    This will setup your database.

    Open integrated terminal in TakeMeOut\frontend:

    npx http-server -p 8080 (or any other port)

    Open your browser and navigate to http://127.0.0.1:8080, use Command + Shift + R to clear browser cache

    

