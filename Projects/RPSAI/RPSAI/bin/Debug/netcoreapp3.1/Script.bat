setlocal
set var1=-1
set var2=-1
for /l %%i in (0, 1, 5) do (
	RPSRandom.exe %var1% %var2%
	set tvar1=%errorlevel%
	RPSAI.exe %var2% %var1%
	set var2=%errorlevel% & set var1=%tvar1%
)
endlocal