:: Why this BAT file? It's a trick to start Glucose Ticker
:: in a separate process so that the taskbar icon won't freeze.
:: You should start Glucose Ticker using this BAT file rather than the EXE
start "Glucose Ticker" /D . "Glucose Ticker.exe"