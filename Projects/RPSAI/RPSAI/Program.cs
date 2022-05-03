using System;

namespace RPSAI
{
    class Program
    {
        //public static int intRock,intPaper,intScissors;
        public static int[] outputs = new int[2];
        public static int[] lastThree = new int[3];
        public static string y = "";
        static void Main(string[] args)
        {
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
            while (rounds < 10000)
            {
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
                //BATTLE RANDOM
                //int prand = (new Random().Next(1, 3));
                int botChoice = 0;
                switch (botNum)
                {
                    case 0: //Random
                        botChoice = ((r.Next(1, 3)));
                        break;
                    case 1: //Same AI
                        decimal AImean = (outputs[0] + outputs[1]) / 2;
                        botChoice = ((int)Math.Round(AImean) + ChosenOne) % 3 + 1;
                        break;
                    case 2: //R -> P -> S ...
                        lastPlay = lastPlay % 3 + 1;
                        botChoice = lastPlay;
                        break;
                    case 3: //R -> S -> P ...
                        lastPlay = (lastPlay - 1) % 3;
                        if (lastPlay == 0)
                            lastPlay = 3;
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
                        case 1:
                            userInput = "rock";
                            break;
                        case 2:
                            userInput = "paper";
                            break;
                        case 3:
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
                        outputs[location % outputs.Length] = 1;
                        lastThree[location % lastThree.Length] = 1;
                        break;
                    case "paper":
                        outputs[location % outputs.Length] = 2;
                        lastThree[location % lastThree.Length] = 2;
                        break;
                    case "scissors":
                        outputs[location % outputs.Length] = 3;
                        lastThree[location % lastThree.Length] = 3;
                        break;
                }
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
                Console.WriteLine("\n\nYour Current Results:\n---------------------\nWins:\t" + results[0] + "\nTies:\t" + results[1] + "\nLosses:\t" + results[2] + "\n---------------------\n");
            }
        }
        public static bool hasAll(int[] arr)
        {
            bool[] arrBool = { false, false, false };
            foreach (int x in arr)
            {
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
