using System;
using System.IO;
using System.Text.Json;

namespace RPSAI
{
    class Program
    {
        public const string FILEPATH = "BN_RPS.txt";

        //public static int intRock,intPaper,intScissors;
        public static int[] outputs = new int[2];
        public static int[] lastThree = new int[3];
        public static string y = "";
        public static int user = -1;
        AIClass rpsAI; // = new AIClass();
        static int Main(string[] args)
        {
            AIClass rpsAI = new AIClass();
            /*
            for (int i = 0; i < args.Length; i++)
            {
                Console.WriteLine("Arg: " + args[i]);// args);
            }*/
            bool blnReset = false;
            if (args.Length == 2)
                if(Int32.Parse(args[0]) == -1 || Int32.Parse(args[1]) == -1)
                    blnReset = true;
            if (File.Exists(FILEPATH) && !blnReset)
            {
                string fileIn = File.ReadAllText(FILEPATH);
                //Console.WriteLine(fileIn);
                if (fileIn != "")
                {
                    string[] fileParms = fileIn.Split(';');

                    int rNum = Int32.Parse(fileParms[0].Trim().Split(':')[1]);
                    int lL = Int32.Parse(fileParms[1].Trim().Split(':')[1]);
                    int lNum = Int32.Parse(fileParms[2].Trim().Split(':')[1]);
                    int lD = Int32.Parse(fileParms[3].Trim().Split(':')[1]);
                    int dNum = Int32.Parse(fileParms[4].Trim().Split(':')[1]);

                    string ArrPass = fileParms[5].Trim().Split(':')[1].Replace('[', ' ').Replace(']', ' ').Trim();
                    int[] lThree = new int[3];
                    for (int i = 0; i < lThree.Length; i++)
                    {
                        lThree[i] = Int32.Parse(ArrPass.Split(',')[i].Trim());
                    }
                    rpsAI = new AIClass(rNum, lL, lNum, lD, dNum, lThree);
                }
            }
            else
            {
                var file = File.Create(FILEPATH);
                rpsAI = new AIClass();
                file.Close();
                File.WriteAllText(FILEPATH, rpsAI.ToString());
                // return(rpsAI.getPlay());
            }
            int winner = -1;
            if (args.Length == 2)
                winner = winCheck(Int32.Parse(args[0]), Int32.Parse(args[1]));

            //Console.WriteLine(winner);
            switch (winner)
            {
                case 0:
                    rpsAI.repeatDraw();
                    //Console.WriteLine(rpsAI.ToString());
                    break;
                case 2:
                    rpsAI.repeatLoss();
                    //Console.WriteLine(rpsAI.ToString());
                    break;
            }
            int xPlay;
            if (args.Length == 2)
                xPlay = rpsAI.getPlay(Int32.Parse(args[1]));
            else
                xPlay = rpsAI.getPlay();
            File.WriteAllText(FILEPATH, rpsAI.ToString());
            //Console.WriteLine(xPlay);
            return xPlay;
        }
        /*
            //File.WriteAllText(FILEPATH, rpsAI.toString());
            bool botChange = false;
            int lastPlay = new Random().Next(1, 3);
            decimal mean = 0;
            int repeatTies = 0;
            int repeatLosses = 0;
            int total = 0;
            int botNum = 0;
            int location = 0;
            string userInput = "";
            int ChosenOne = 1;
            Console.WriteLine("Welcome to the world of Rock, Paper, Scissors!");
            //"\nWho would you like to fight ?");
            //string choice = Console.ReadLine();
            Console.WriteLine("Would you like a bot to play for you? (Y/N)");
            string temp = Console.ReadLine();
            if (temp.ToUpper() == "Y")
            {
                Console.WriteLine("Would you like to alternate between all bots? (Y/N) *No -> Select a bot\n");
                if (Console.ReadLine().ToUpper() == "Y")
                    botChange = true;
                else {
                    Console.WriteLine("Which bot would you like to replace you\nRandom: 0\nSame AI: 1\nAlternating: 2\nReverse Alternating: 3\nPick One: 4");
                    Int32.TryParse(Console.ReadLine(), out botNum);
                    switch (botNum)
                    {
                        case 1:
                            Console.WriteLine("Offset: 0 -> 2");
                            Int32.TryParse(Console.ReadLine(), out ChosenOne);
                            ChosenOne = ChosenOne % 3;
                            break;
                        case 4:
                            Console.WriteLine("What move would you like to play everytime?\nRock: 1\nPaper: 2\nScissors: 3\n");
                            Int32.TryParse(Console.ReadLine(), out ChosenOne);
                            ChosenOne = ChosenOne % 3 + 1;
                            break;
                    }
                }
            }
            int[] results = { 0, 0, 0 };
            int rounds = 0;
            int l3Total = 0;
            Random r = new Random();
            int tempBot = -1;
            while (rounds < 100)
            {
                File.WriteAllText(FILEPATH, rpsAI.ToString());
                if (botChange)
                {
                    botNum = changeBot(rounds, botNum, ChosenOne)[0];
                    ChosenOne = changeBot(rounds, botNum, ChosenOne)[1];
                    if (botNum > tempBot)
                    {
                        repeatLosses = 0;
                        tempBot++;
                    }
                }
                rounds++;
                total = 0;
                mean = 0;
                Console.WriteLine("\nGame " + rounds + ":\nRock,Paper,Scissors\nGo...\n");
                for (int i = 0; i < outputs.Length; i++)
                {
                    if (outputs[i] > 0)
                        total++;
                    mean += outputs[i];
                }
                //rpsAI = new AIClass(rounds - 1, repeatLosses, new int[]{-1,-1,-1});
                /*
                if (total <= 0)
                    mean = (new Random()).Next(1, 3);
                else if (hasAll(lastThree))
                    mean = lastThree[(location+1)%lastThree.Length];
                else if (repeatLosses >= 10)
                    mean = (Math.Round(mean / total)+1) % 3 + 1;
                //else if (repeatTies > 3)
                  //  mean = (Math.Round(mean / total) + 2) % 3 + 1;
                else
                    mean = Math.Round(mean / total);

                mean = rpsAI.getPlay(user);
                Console.WriteLine(rpsAI.ToString());
                //BATTLE RANDOM
                //int prand = (new Random().Next(1, 3));
                int botChoice = 0;
                switch (botNum)
                {
                    case 0: //Random
                        botChoice = r.Next(0, 2);
                        break;
                    case 1: //Same AI
                        decimal AImean = (outputs[0] + outputs[1]) / 2;
                        botChoice = ((int)Math.Round(AImean) + ChosenOne) % 3;
                        break;
                    case 2: //R -> P -> S ...
                        lastPlay = lastPlay % 3;
                        botChoice = lastPlay;
                        break;
                    case 3: //R -> S -> P ...
                        lastPlay = (lastPlay - 1) % 3;
                        botChoice = lastPlay;
                        break;
                    case 4: //Pick One
                        botChoice = ChosenOne;
                        break;
                }
                if (temp.ToUpper() == "Y")
                {
                    temp = "Y";
                    //switch
                    switch (botChoice)
                    {
                        case 0:
                            userInput = "rock";
                            break;
                        case 1:
                            userInput = "paper";
                            break;
                        case 2:
                            userInput = "scissors";
                            break;
                    }
                }
                else
                    userInput = Console.ReadLine().ToLower();

                location++;
                
                switch (userInput)
                {
                    case "rock":
                        //outputs[location % outputs.Length] = 1;
                        //lastThree[location % lastThree.Length] = 1;
                        user = 0;
                        break;
                    case "paper":
                        //outputs[location % outputs.Length] = 2;
                        //lastThree[location % lastThree.Length] = 2;
                        user = 1;
                        break;
                    case "scissors":
                        //outputs[location % outputs.Length] = 3;
                        //lastThree[location % lastThree.Length] = 3;
                        user = 2;
                        break;
                }
                
                int intWinner = winCheck((int)mean, user);

                switch (intWinner)
                {
                    case 0:
                        Console.WriteLine("Draw");
                        results[1]++;
                        rpsAI.repeatDraw();
                        break;
                    case 1:
                        Console.WriteLine("P1 Wins");
                        results[0]++;
                        rpsAI.repeatLoss();
                        break;
                    case 2:
                        Console.WriteLine("P2 Wins");
                        results[2]++;
                        
                        break;
                }
                /*
                switch (mean)
                {
                    case 1:
                        if (temp == "Y")
                            Console.WriteLine("Player: " + (userInput[0]).ToString().ToUpper() + userInput.Substring(1));
                        Console.WriteLine("AI: Paper");
                        break;
                    case 2:
                        if (temp == "Y")
                            Console.WriteLine("Player: " + (userInput[0]).ToString().ToUpper() + userInput.Substring(1));
                        Console.WriteLine("AI: Scissors");
                        break;
                    case 3:
                        if (temp == "Y")
                            Console.WriteLine("Player: " + (userInput[0]).ToString().ToUpper() + userInput.Substring(1));
                        Console.WriteLine("AI: Rock");
                        break;
                }
                if (mean == 1)//Paper
                {
                    if (userInput == "scissors")
                    {
                        Console.WriteLine("You Win!");
                        results[0]++;
                        repeatLosses++;
                    }
                    else if (userInput == "paper")
                    {
                        Console.WriteLine("You Tied!");
                        results[1]++;
                        //repeatLosses = 0;
                        //repeatTies++;
                    }
                    else
                    {
                        Console.WriteLine("You Lost!");
                        results[2]++;
                        //repeatLosses = 0;
                        //repeatTies = 0;
                    }
                }
                else if (mean == 2)//Scissors
                {
                    if (userInput == "scissors")
                    {
                        Console.WriteLine("You Tied!");
                        results[1]++;
                        //repeatLosses = 0;
                        //repeatTies++;
                    }
                    else if (userInput == "rock")
                    {
                        Console.WriteLine("You Win!");
                        results[0]++;
                        repeatLosses++;
                    }
                    else
                    {
                        Console.WriteLine("You Lost!");
                        results[2]++;
                        //repeatLosses = 0;
                        //repeatTies = 0;
                    }
                }
                else if (mean == 3)//Rock
                {
                    if (userInput == "rock")
                    {
                        Console.WriteLine("You Tied!");
                        results[1]++;
                        //repeatLosses = 0;
                        //repeatTies++;
                    }
                    else if (userInput == "paper")
                    {
                        Console.WriteLine("You Win!");
                        results[0]++;
                        repeatLosses++;
                    }
                    else
                    {
                        Console.WriteLine("You Lost!");
                        results[2]++;
                        //repeatLosses = 0;
                        //repeatTies = 0;
                    }
                    Console.WriteLine(mean);
                }
                */
                //Console.WriteLine("\n\nYour Current Results:\n---------------------\nWins:\t" + results[0] + "\nTies:\t" + results[1] + "\nLosses:\t" + results[2] + "\n---------------------\n" + botChoice);
            
            //Console.WriteLine((int)Math.Round(mean));
            //return (int)Math.Round(mean);
        
        //Inputs
        //  0: rock
        //  1: paper
        //  2: scissors
        //Outputs 0 for draw, 1 for P1 win, 2 for P2 win
        public static int winCheck(int P1, int P2)
        {
            if (P1 == P2) //Determines Draw
                return 0;
            else if (P1 == 0) { 
                if (P2 == 1)
                    
                    return 2; //P1 Rock, *P2 Paper
                else
                    return 1; //*P1 Rock, P2 Scissors
            }
            else if (P1 == 1) { 
                if (P2 == 0)
                    return 1; //*P1 Paper, P2 Rock
                else
                    return 2; //P1 Paper, *P2 Scissors
            }
            else {
                if (P2 == 0)
                    return 2; //P1 Scissors, *P2 Rock
                else
                    return 1; //*P1 Scissors, P2 Paper
            }
        }


        public static bool hasAll(int[] arr)
        {
            bool[] arrBool = { false, false, false };
            foreach (int x in arr)
            {
                //arrBool[x] = true;
                
                switch (x)
                {
                    case 1:
                        arrBool[0] = true;
                        break;
                    case 2:
                        arrBool[1] = true;
                        break;
                    case 3:
                        arrBool[2] = true;
                        break;
                }
            }
            return arrBool[0] && arrBool[1] && arrBool[2];
        }
        static int changes = 0;
        public static int[] changeBot(int round, int botNum = 0, int botChosen = 0) {
            const int INCREMENT = 100;
            int[] returnArr = {botNum, botChosen };
            if (round > INCREMENT * changes) {
                if (changes == 1)
                    returnArr[0]++;
                else if (changes > 1 && changes <= 3)
                    returnArr[1]++;
                else if (changes >= 4 && changes <= 5)
                {
                    returnArr[0]++;
                    returnArr[1] = 0;
                }
                else if (changes == 6)
                    returnArr[0]++;
                else if (changes > 6 && changes <= 8)
                    returnArr[1]++;
                else if(changes > 8)
                    returnArr[0] = 0;
                changes++;
            }
            return returnArr;
        }
    }
}
