import requests
import chess
import json
import webbrowser
import random

url = "https://lichess.org/api/"
token = "lip_dQJI4YyJYwytH4emLoyq"  #"lip_iVIs8rv6xLi4ZZQPNShG"
#Tokens need to have bot:play, challenge:read, challenge:write
##      permissions when created


##Checks token used to see if account is a bot account.
##If bot->continues, Else->asks user if they would like account to become a bot.
try:
    a = requests.get(url+"account", headers = {"Authorization":'Bearer '+token})
    if a.status_code == 200:
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
    GameInfo = [chal['id'],chal['challenger']['id']]
    return GameInfo

##Gets challenges that are available to the account and token
def getChallenges():
    challist = requests.get(url+"challenge", headers = {"Authorization":'Bearer '+token})

    chs = []
    for i in range(len(challist.json()['in'])):
        challenge = challist.json()['in'][i]
        x = getGameInfo(challenge)
        chs += [x]
        print("Challenge Number:",i,"\n\tGame Id: "+x[0],"\n\tChallenger: "+x[1])
    return chs

##Ensures the user input is an integer
def user_Number(val):
    try:
        return int(val)
    except ValueError:
        print("\tInput is not an integer! Please enter an integer")
        return -1

def getActiveGames():
    gameList = requests.get(url+"account/playing", headers = {"Authorization":'Bearer '+token}, stream=True).json()['nowPlaying']

    gms = []
    for i in range(len(gameList)):
        game = gameList[i]
        x = [game['gameId'],game['color'],game['opponent']['id']]
        gms += [x]

        print("Game Number:",i,"\n\tGame Id: "+x[0],"\n\tBot Color: "+x[1],"\n\tOpponent: "+x[2])
    return gms

def getRandomLegalMove(state):
    legalMoveArr = []
    for x in state.legal_moves:
        legalMoveArr += [x]
    return legalMoveArr[random.randint(0,len(legalMoveArr)-1)].uci()
        

##Ensures challenge or game is selected before continuing.
##This ensures that the user does not need to restart program for a challenge
##  or game to be sent if not avaiable at start. The bot profile can then be
##  opened to send the challenge if need be.
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
            try:
                for x in lineTemp['state']['moves'].split(' '):
                    if x:
                        board.push(chess.Move.from_uci(x))
                        skipUpdate = True
                    else:
                        break
                if len(lineTemp['state']['moves'].split(' '))%2 == botColor:
                    botMove = getRandomLegalMove(board)
                    requests.post(url+'bot/game/'+chalId+'/move/'+botMove, headers = {"Authorization":'Bearer '+token})
            except KeyError:
                if not skipUpdate:
                    board.push(chess.Move.from_uci(lineTemp['moves'].split(' ')[-1]))
                if len(lineTemp['moves'].split(' '))%2 == botColor:
                    botMove = getRandomLegalMove(board)
                    requests.post(url+'bot/game/'+chalId+'/move/'+botMove, headers = {"Authorization":'Bearer '+token})
            print(board,'\n')
else:
    print("Error Code:",a.status_code,"-",a.reason)
