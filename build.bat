@echo off
echo Copying index.html to www...
copy index.html www\index.html

echo Fixing CDN references in www\index.html...
powershell -Command "(Get-Content www\index.html) -replace '<!-- saved from url.*?-->', '' -replace '<script src=""./index_files/saved_resource""></script>', '' -replace '<link rel=""stylesheet"" href=""./index_files/all.min.css"">', '<link rel=""stylesheet"" href=""https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"">' -replace '<link href=""./index_files/css2"" rel=""stylesheet"">', '<link href=""https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Inter:wght@400;500;600;700&display=swap"" rel=""stylesheet"">' | Set-Content www\index.html"

echo Syncing Capacitor...
npx cap sync android
echo Done!