@echo off

setlocal enabledelayedexpansion 
SET P1=0
SET P2=0
SET D=0
SET VAR1=-1
SET VAR2=-1
FOR /L %%a in (1,1,1000) do (
	echo Player 1: !VAR1! Player 2: !VAR2!
	RandomRPS.exe !VAR1! !VAR2!
	set TVAR1=!errorlevel!
	RPSAI.exe !VAR2! !VAR1!
	set TVAR2=!errorlevel!

	SET VAR1=!TVAR1! & SET VAR2=!TVAR2!
	call :Print %%a !VAR1! !VAR2!
)
endlocal
ECHO END
pause
exit

:Print <arg1> <arg2> <arg3>
	echo Game: %1
	echo P1: %2 P2: %3
	call :Winner %2 %3
	echo P1: !P1! Draws: !D! P2: !P2!
	echo ----------------
	goto :eof

:Winner <arg1> <arg2>
	if %1 == %2 (
		echo Draw
		set /A D+=1
	)
	if %1 == 0 (
		if %2 == 1 (
			echo P2 Win
			set /A P2+=1
		)
		if %2 == 2 (
			echo P1 Win
			set /A P1+=1
		)
	)
	if %1 == 1 (
		if %2 == 0 (
			echo P1 Win
			set /A P1+=1
		)
		if %2 == 2 (
			echo P2 Win
			set /A P2+=1
		)
	)
	if %1 == 2 (
		if %2 == 0 (
			echo P2 Win
			set /A P2+=1
		)
		if %2 == 1 (
			echo P1 Win
			set /A P1+=1
		)
	)
	goto :eof