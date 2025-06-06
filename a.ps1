# Sensor paths
$sensorPaths = @(
    "/nfads/water_temperature_sensor/value",
    "/nfads/ph_Sensor/value",
    "/nfads/tds_sensor/value",
    "/nfads/ec_sensor/value",
    "/nfads/peristaltic_pump_a/value",
    "/nfads/peristaltic_pump_b/value",
    "/nfads/peristaltic_pump_phup/value",
    "/nfads/peristaltic_pump_phdown/value",
    "/nfads/water_pump/value",
    "/nfads/solenoid_valve/value",
    "/nfads/peltier_module/value",
    "/nfads/compressor_module/value",
    "/nfads/oled_display_nfads/value",
    "/nfads/water_flow_meter/value",
    "/lms/ldr_sensor/value",
    "/lms/bh1750_sensor/value",
    "/lms/tsl2591_sensor/value",
    "/lms/as7265x/value",
    "/lms/grow_lights_a/value",
    "/lms/grow_lights_b/value",
    "/lms/grow_lights_c/value",
    "/lms/dimmable_module/value",
    "/lms/oled_module_lms/value",
    "/ems/dht22_temp/value",
    "/ems/dht22_moisture/value",
    "/ems/pressure_sensor/value",
    "/ems/oxygen_sensor/value",
    "/ems/carbon_dioxide_sensor/value",
    "/ems/indoor_cooling_system/value",
    "/ems/exhaust_fan/value",
    "/ems/oled_module_ems/value",
    "/ems/diaphragm_pump/value"
)

# API base URL
$baseUrl = "http://localhost:3000/api"

foreach ($path in $sensorPaths) {
    $endpoint = "$baseUrl$path"
    
    # Dummy data for POST request
    $body = @{
        "Timestamp" = (Get-Date -Format "dd-MM-yyyy HH:mm:ss")
        "Device ID" = "EMS"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Method POST -Uri $endpoint -Body $body -ContentType "application/json"
        Write-Host "✅ Posted dummy data to $endpoint"
    }
    catch {
        Write-Host "❌ Failed to POST to $endpoint - $_"
    }
}

Write-Host "`n🧪 Dummy data sent to all sensor endpoints."
