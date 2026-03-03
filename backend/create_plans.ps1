# PowerShell script to create subscription plans
# Run with: .\create_plans.ps1

Write-Host "Creating subscription plans..." -ForegroundColor Green

Get-Content "add_subscription_plans.py" | python manage.py shell

Write-Host "`nDone! Check output above for results." -ForegroundColor Green
