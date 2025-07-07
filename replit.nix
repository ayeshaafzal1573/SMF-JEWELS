{ pkgs }: {
  deps = [
    pkgs.python312
    pkgs.python312Packages.uvicorn
    pkgs.python312Packages.fastapi
    pkgs.python312Packages.pymongo
    pkgs.python312Packages.motor
    pkgs.python312Packages.python-dotenv
    pkgs.python312Packages.email_validator
    pkgs.python312Packages.passlib 
    pkgs.python312Packages.python-jose
    pkgs.python312Packages.authlib
    

  ];
}
