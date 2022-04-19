import requests

url = "https://lichess.org/api/"#"account"
token = "lip_iVIs8rv6xLi4ZZQPNShG"

nonBotToken = "lip_fGHA6JZgUOA0g0yGblOs"
#"lip_MgRMXamwP513c4IxjoUf"
#a = requests.get(url+"account", headers = {"Authorization":'Bearer '+nonBotToken})

try:
    a = requests.get(url+"account", headers = {"Authorization":'Bearer '+token})
    if a.status_code == 200:
        if a.json()['title'] == 'BOT':
            print("Bot Account Used")
    else:
        print(a.status_code, ': Error Occurred -', a.reason)
except KeyError:
    print("Bot Account Needed!")
    if(input("Would you like you upgrade? (Y/N)").lower() == 'y'):
        a = requests.post(url+"bot/account/upgrade", headers = {"Authorization":'Bearer '+token})
        if a.status_code == 200:
            print("Upgrade Complete")
        else:
            print(a.status_code, ': Error Occurred -', a.reason)
    else:
        print("Exiting...")
        exit()

urlgame = url+"bot/game/"
gameId = "g8ve2FdLZICu"#input("Please enter the gameId")
s = requests.Session()
a = s.get(urlgame+"stream/"+gameId, headers = {"Authorization":'Bearer '+token})
#print(a.status_code)
print(a)
if a.status_code == 200:
    print(a.json())
