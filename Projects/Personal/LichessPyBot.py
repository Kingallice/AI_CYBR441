##Imports
import requests #API Calls
import chess    #Chess Library
import json     #Interprets JSON
import webbrowser   #Allows Opening Bot Profile in Browser
import random   #Random
import time     #Time
import threading    #Allows Multiple Instances of the Bot

url = "https://lichess.org/api/" #Base URL for lichess.org api

token = "lip_dQJI4YyJYwytH4emLoyq"  #"lip_iVIs8rv6xLi4ZZQPNShG"
#Tokens need to have bot:play, challenge:read, challenge:write
##      permissions when created

##Global Variables
AccId = ''

##Checks token used to see if account is a bot account.
##If bot->continues, Else->asks user if they would like account to become a bot.
try:
    a = requests.get(url+"account", headers = {"Authorization":'Bearer '+token})
    if a.status_code == 200:
        AccId = a.json()['id']
        if a.json()['title'] == 'BOT':
            print("Bot Account Used")
    else:
        print(a.status_code, ': Error Occurred -', a.reason)
except KeyError:
    print("Bot Account Needed!")
    if(input("Would you like you upgrade? (Y/N)\n").lower() == 'y'):
        a = requests.post(url+"bot/account/upgrade", headers = {"Authorization":'Bearer '+token})
        if a.status_code == 200:
            print("Upgrade Complete")
        else:
            print(a.status_code, ': Error Occurred -', a.reason)
    else:
        print("Exiting...")
        exit()

##Gets info about challenge passed to function
def getGameInfo(chal):
    GameInfo = [chal['id'],chal['challenger']['id'],chal['color']]
    return GameInfo

##Gets challenges that are available to the account
def getChallenges():
    challist = requests.get(url+"challenge", headers = {"Authorization":'Bearer '+token})

    chs = []
    for i in range(len(challist.json()['in'])):
        challenge = challist.json()['in'][i]
        x = getGameInfo(challenge)
        chs += [x]
        #print("Challenge Number:",i,"\n\tGame Id: "+x[0],"\n\tChallenger: "+x[1])
    return chs

##Ensures the user input is an integer
def user_Number(val):
    try:
        return int(val)
    except ValueError:
        print("\tInput is not an integer! Please enter an integer")
        return -1

##Finds current active games of the account
def getActiveGames():
    gameList = requests.get(url+"account/playing", headers = {"Authorization":'Bearer '+token}, stream=True).json()['nowPlaying']

    gms = []
    for i in range(len(gameList)):
        game = gameList[i]
        x = [game['gameId'],game['color'],game['opponent']['id']]
        gms += [x]
        #print("Game Number:",i,"\n\tGame Id: "+x[0],"\n\tBot Color: "+x[1],"\n\tOpponent: "+x[2])
    return gms

def getRandomLegalMove(state):
    legalMoveArr = []
    for x in state.legal_moves:
        legalMoveArr += [x]
    return legalMoveArr[random.randint(0,len(legalMoveArr)-1)].uci()

def getRandomLegalMove_TakePreferred(state):
    legalMoveArr = []
    legalCaptures = []
    for x in state.generate_legal_captures():
        legalCaptures += [x]
    if len(legalCaptures) > 0:
        legalMoveArr = legalCaptures
    else:
        for x in state.legal_moves:
            legalMoveArr += [x]
    return legalMoveArr[random.randint(0,len(legalMoveArr)-1)].uci()
        
##Ensures challenge or game is selected before continuing.
##This ensures that the user does not need to restart program for a challenge
##  or game to be sent if not avaiable at start. The bot profile can then be
##  opened to send the challenge if need be.
## **MAINLY FOR TESTING
def runBot():
    chalId = -1
    botColor = -1
    while chalId == -1:
        inGC = input("Would you like to accept a challenge(c) or continue active game(g)?\n")

        if "c" in inGC.lower():
            ##Gets challenges available to bot and allows user to select one
            challenges = []
            cnum = -1
            while cnum <= -1 or cnum >= len(challenges):
                challenges = getChallenges()
                if len(challenges) == 0:
                    print("No Challenges Available! Please send a challenge to",requests.get(url+"account", headers = {"Authorization":'Bearer '+token}).json()['username'])
                    inGC = ''
                    break
                cnum = user_Number(input("Which challenge would you like to select? (Enter Number)\n"))
                if cnum <= -1 or cnum >= len(challenges):
                    print("\tPlease input a valid number of a challenge!\n")

            if cnum != -1:
                chalId = challenges[cnum][0]
                requests.post(url+'challenge/'+chalId+'/accept', headers = {"Authorization":'Bearer '+token}, )
                if challenges[cnum][2] == 'white':
                    botColor = 1
                else:
                    botColor = 0
        else:
            ##Gets games currently active and allows user to select one to continue
            games = []
            gnum = -1
            while gnum <= -1 or gnum >= len(games):
                games = getActiveGames()
                if len(games) == 0:
                    print("No Active Games Available! Please send a challenge to",requests.get(url+"account", headers = {"Authorization":'Bearer '+token}).json()['username'])
                    break
                gnum = user_Number(input("Which game would you like to continue? (Enter Number)\n"))
                if gnum <= -1 or gnum >= len(games):
                    print("\tPlease input a valid number of a game!\n")
            if gnum != -1:
                chalId = games[gnum][0]
                if games[gnum][1] == 'white':
                    botColor = 0
                else:
                    botColor = 1
                    

        if chalId == -1:
            openBrowser = input("Would you like to open the bot's profile in a browser?(Y/N)")
            if openBrowser.lower() == 'y':
                webbrowser.open(requests.get(url+"account", headers = {"Authorization":'Bearer '+token}).json()['url'])

    s = requests.Session()
    a = s.get(url+"bot/game/stream/"+chalId, headers = {"Authorization":'Bearer '+token}, stream=True)
    #print(a.status_code)
    board = chess.Board()
    if a.status_code == 200:
        for line in a.iter_lines():
            if line:
                #print(line)
                skipUpdate = False
                lineTemp = json.loads(line.decode('utf-8'))
                keyArr = []
                for x in lineTemp.keys():
                    keyArr += [x]
                try:
                    if 'winner' in keyArr:
                        if lineTemp['winner'] == 'white':
                            if botColor == 0:
                                    print('Bot Win')
                            else:
                                    print('Challenger Win')
                            break
                    elif 'state' in keyArr:
                        lineTemp = lineTemp['state']
                        for x in lineTemp['moves'].split(' '):
                            if x:
                                board.push(chess.Move.from_uci(x))
                    else:
                        board.push(chess.Move.from_uci(lineTemp['moves'].split(' ')[-1]))
                    if len(lineTemp['moves'].split(' '))%2 == botColor or (lineTemp['moves'] == '' and botColor == 0):
                        botMove = getRandomLegalMove(board)
                        requests.post(url+'bot/game/'+chalId+'/move/'+botMove, headers = {"Authorization":'Bearer '+token})
                    #print(board,'\n')
                except KeyError:
                    print("Key Error")
    else:
        print("Error Code:",a.status_code,"-",a.reason)
## END OF RUNBOT


##Gets a random legal move and plays it
def MakeRandomMove(chal, color, line, board):
    if len(line['moves'].split(' '))%2 == color or (line['moves'] == '' and color == 0):
        botMove = getRandomLegalMove(board)
        requests.post(url+'bot/game/'+chal[0]+'/move/'+botMove, headers = {"Authorization":'Bearer '+token})
    return board

##Gets a random legal move and plays it
def MakeRandomMove_TakePreferred(chal, color, line, board):
    if len(line['moves'].split(' '))%2 == color or (line['moves'] == '' and color == 0):
        botMove = getRandomLegalMove_TakePreferred(board)

        #tBoard = board.copy()
        #print(tBoard)
        #tBoard.push_uci(botMove)
        #print(tBoard)
        if board.piece_type_at(chess.parse_square(botMove[0:2])) == 5:
            for x in board.attackers(color, chess.parse_square(botMove[2:])):
                print(x, '-', board.piece_at(x))
                
        #for x in tBoard.attackers(color,tBoard.piece_at(chess.parse_square(botMove[0:2]))):
        #    print(tBoard.turn, tBoard.piece_at(x))
        #print('\n\tMove:', botMove,'\tLen',len(botMove))
        if len(botMove) > 4:
            botMove = botMove[0:-1] + 'q'
        requests.post(url+'bot/game/'+chal[0]+'/move/'+botMove, headers = {"Authorization":'Bearer '+token})
    return board

##Will start or resume a challenge passed
##If active game -> resume | if challenge -> accept and play
def startMatch(chal):
    ##Accepts Challenge Passed
    requests.post(url+'challenge/'+chal[0]+'/accept', headers = {"Authorization":'Bearer '+token})
    ##Creates Session for Game Stream
    s = requests.Session()
    ##Calls API for stream of Game States
    a = s.get(url+"bot/game/stream/"+chal[0], headers = {"Authorization":'Bearer '+token}, stream=True)
    board = chess.Board()
    botColor = -1
    ##If ok -> continue moves
    if a.status_code == 200:
        ##Reads each line sent to bot instance
        for line in a.iter_lines():
            if line:
                line = json.loads(line.decode('utf-8'))
                #print(line)
                keyArr = []
                ##Places all keys into array to be searched
                for x in line.keys():
                    keyArr += [x]
                ##If 'winner' key -> stop Instance
                if 'winner' in keyArr:
                        break
                ##If 'state' key -> setup current state of game
                elif 'state' in keyArr:
                    tempArr = []
                    for x in line['white'].keys():
                        tempArr += [x]
                    if 'id' in tempArr:
                        if line['white']['id'] == AccId:
                            botColor = 0
                    else:
                        botColor = 1
                    line = line['state']
                    for x in line['moves'].split(' '):
                        if x:
                            board.push(chess.Move.from_uci(x))
                ##Update board
                else:
                    board.push(chess.Move.from_uci(line['moves'].split(' ')[-1]))
                ##Make Move
                board = MakeRandomMove_TakePreferred(chal, botColor, line, board)

##Gets all active games and resumes them
def ResumeGames():
    challenges = getActiveGames()

    for x in challenges:
        t = threading.Thread(target = startMatch, args=(x,))
        t.start()

##Constantly looks for challenges; accepts and plays them
def AutoBot():
    challenges = getChallenges()

    for x in challenges:
        t = threading.Thread(target = startMatch, args=(x,))
        t.start()
    #time.sleep(5)

ResumeGames()
while True:
    AutoBot()
