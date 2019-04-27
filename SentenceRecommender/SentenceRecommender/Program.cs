using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SentenceRecommender
{
    class TrieNode
    {
        public HashSet<TrieNode> children;
        public int amtFinishes;
        public string value;

        public TrieNode()
        {
            children = new HashSet<TrieNode>();
            amtFinishes = 0;
        }
        public TrieNode(string val)
        {
            children = new HashSet<TrieNode>();
            amtFinishes = 0;
            value = val;
        }
        public TrieNode FindChildNode(string theString)
        {
            foreach(TrieNode curTN in children)
            {
                if (curTN.value.Equals(theString))
                    return curTN;
            }
            return null;
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            TrieNode head = new TrieNode();

            List<string> theList = new List<string>();

            theList.Add("Hello my name is garrett yee");
            theList.Add("Hello my name is garrett yee");
            theList.Add("Hello my name is garrett yee");
            theList.Add("Hello my name is garrett yee");
            theList.Add("Hello my name is kenny");
            theList.Add("Hello my name is garrett");
            theList.Add("Hello my name is garrett");
            theList.Add("Hello my name is kenny");
            theList.Add("Hello my name is kenny");
            theList.Add("Hello my name is kenny lol");
            theList.Add("Hello my name is kenny lol");
            theList.Add("Hello my name is kenny lol");
            theList.Add("Hello my name is kenny lol");
            theList.Add("Hello my name is garrett yee");
            theList.Add("Hello my name is garrett yee");
            theList.Add("dude my name is kenny");
            theList.Add("dude my name is kenny lol");
            theList.Add("dude my name is kenny lol");
            theList.Add("dude my name is kenny lol");
            theList.Add("dude my name is kenny lol");
            theList.Add("dude my name is garrett yee");
            theList.Add("dude my name is garrett yee");

            List<string[]> tokenized = new List<string[]>();

            for(int i = 0; i < theList.Count; i++)
            {
                theList[i] = theList[i].ToLower();

                string[] words = theList[i].Split(' ');
                tokenized.Add(words);
            }

            
            for (int i = 0; i < tokenized.Count; i++)
            {
                TrieNode cur = head;
                for(int j = 0; j < tokenized[i].Length; j++)
                {
                    TrieNode child = cur.FindChildNode(tokenized[i][j]);
                    if (child != null)
                    {
                        Console.WriteLine("Found child node");
                        cur = child;
                    }
                    else
                    {
                        Console.WriteLine("No child node, creating one");
                        TrieNode newChild = new TrieNode(tokenized[i][j]);
                        cur.children.Add(newChild);
                        cur = newChild;
                    }
                    cur.amtFinishes++;
                }
                //cur.amtFinishes++;
                Console.WriteLine(cur.amtFinishes);
            }

            Recommend("", head);

            Console.Read();
        }

        public static string Recommend(string sentence, TrieNode head)
        {
            TrieNode cur = head;
            string[] words = sentence.Split(' ');

            string recommendation = "";

            if (sentence.Length > 0)
            {
                foreach (string curWord in words)
                {
                    TrieNode next = cur.FindChildNode(curWord);
                    if (next == null)
                    {
                        Console.WriteLine("did not find the word");
                        return null;
                    }
                    else
                    {
                        cur = next;
                    }
                    recommendation += curWord + " ";
                }
            }
            TrieNode maxChild = FindMaxChild(cur);

            if(maxChild != null)
                Console.WriteLine("found greatest " + maxChild.value);
            else
                Console.WriteLine("no child nodes found");
            
            recommendation += maxChild.value;
            Console.WriteLine(recommendation);
            return recommendation;
        }

        public static TrieNode FindMaxChild(TrieNode cur)
        {
            if (cur.children.Count == 0)
                return null;
            else
            {
                TrieNode curMaxChild = null;
                foreach(TrieNode curChild in cur.children)
                {
                    if (curMaxChild == null || curMaxChild.amtFinishes < curChild.amtFinishes)
                        curMaxChild = curChild;
                }

                return curMaxChild;
            }
        }
    }
}
