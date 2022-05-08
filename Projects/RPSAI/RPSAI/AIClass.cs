using System;
using System.Collections.Generic;
using System.Text;

namespace RPSAI
{
    class AIClass
    {
        private int[] lastThree = {-1,-1,-1};
        private int roundNumber, lastLoss, repeatLosses, lastDraw, repeatDraws;
        public AIClass()
        {
            lastThree = new int[] {-1, -1, -1};
            repeatLosses = 0;
            repeatDraws = 0;
            roundNumber = 0;
        }
        public AIClass(int round, int lastL, int losses, int lastD, int draws, int[] prevThree)
        {
            roundNumber = round;
            lastLoss = lastL;
            repeatLosses = losses;
            lastDraw = lastD;
            repeatDraws = draws;
            lastThree = prevThree;
        }
        public int getPlay(int OppLast = -1)
        {
            int play = new Random().Next(0, 3);

            if (OppLast != -1) {
                lastThree[(roundNumber) % lastThree.Length] = OppLast;
            }
            decimal mean;
            
            mean = (lastThree[(roundNumber) % lastThree.Length] + lastThree[(roundNumber+2) % lastThree.Length]) / 2;
            //Console.WriteLine(roundNumber + ":" + lastThree[(roundNumber-1) % lastThree.Length] + "-" + lastThree[roundNumber % lastThree.Length]);
            if (roundNumber > 1)
            {
                play = (int)mean;
            }
            else if (hasAll(lastThree))
            {
                play = lastThree[(roundNumber + 1) % lastThree.Length];
            }
            else if (repeatLosses >= 10)
                play = (int)((Math.Round(mean) + 1) % 3);
            //else if 
            /*            if (roundNumber == 1) {

            }
            else if (hasAll(lastThree))
                return lastThree[(location + 1) % lastThree.Length];
            else if (repeatLosses >= 10)
                return (Math.Round(mean / total) + 1) % 3 + 1;
            else
                return Math.Round(mean / total);

            return play;*/
            roundNumber++;
            return play;
        }

        public bool hasAll(int[] arr)
        {
            bool[] arrBool = { false, false, false };
            foreach (int x in arr)
            {
                switch (x)
                {
                    case 0:
                        arrBool[0] = true;
                        break;
                    case 1:
                        arrBool[1] = true;
                        break;
                    case 2:
                        arrBool[2] = true;
                        break;
                }
            }
            return arrBool[0] && arrBool[1] && arrBool[2];
        }
        public void repeatLoss()
        {
            if (roundNumber - 1 == lastLoss)
                repeatLosses++;
            else
            {
                lastLoss = roundNumber;
                repeatLosses = 0;
            }
        }
        public void repeatDraw()
        {
            if (roundNumber - 1 == lastDraw)
                repeatDraws++;
            else
            {
                lastDraw = roundNumber;
                repeatDraws = 0;
            }
        }

        public string ToString()
        {
            string strOut = "RoundNumber: " + roundNumber +"; LastLoss: " + lastLoss + "; RepeatLoss: " + repeatLosses + "; LastDraw: " + lastDraw + "; RepeatDraw: " + repeatDraws + "; LastThree: [";

            for(int i = 0; i < lastThree.Length; i++)
            {
                if (i == 0)
                    strOut += lastThree[i];
                else
                    strOut += ", " + lastThree[i];
            }
            strOut += "]";
            return strOut;
        }
    }
}
        /*
        if (total <= 0)
                    mean = (new Random()).Next(1, 3);
                else if (hasAll(lastThree))
                    mean = lastThree[(location + 1) % lastThree.Length];
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
        botChoice = ((int) Math.Round(AImean) + ChosenOne) % 3 + 1;
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
}
}
*/