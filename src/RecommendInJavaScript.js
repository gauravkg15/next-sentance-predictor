class TrieNode
{

  constructor(value)
  {
    this.children = new Set();
    this.amtFinishes = 0;
    this.value = value;
  }
  findChildNode(theString)
  {
    for (let curTN of this.children)
    {
      //console.info("found" + theString + curTN.value);
      //if(curTN.value.localeCompare(theString))
      if(curTN.value === theString)
      {
        //console.info("same")
        return curTN;
      }
    }
    return null;
  }

}

function findMaxChild(cur)
{
  if(cur.children.length === 0)
  {
    return null;
  }
  else
  {
    var curMaxChild = null;
    for (let curChild of cur.children)
    {
      if(curMaxChild === null || curMaxChild.amtFinishes < curChild.amtFinishes)
      {
        curMaxChild = curChild;
      }
    }

    return curMaxChild;
  }
}

function Recommend(sentence, head)
{
  var cur = head;
  var words = sentence.split(" ");
  var recommendation = "";

  if(sentence.length > 0)
  {
    var i;
    for(i = 0; i < words.length; i++)
    {
      var next = cur.findChildNode(words[i]);
      if(next === null)
      {
        console.info("did not find the word");
        return null;
      }
      else
      {
        cur = next;
      }
      recommendation += words[i] + " ";
    }
  }
  var maxChild = findMaxChild(cur);

  if(maxChild !== null)
  {
    console.info("found greatest " + maxChild.value);
  }
  else
  {
    console.info("no child nodes found");
  }

  recommendation += maxChild.value;
  console.info(recommendation);
  return recommendation.split(' ').pop();
}

var head = new TrieNode("");
var theList = [];
theList.push("Hello my name is garrett yee");
theList.push("Hello my name is garrett yee");
theList.push("Hello my name is garrett yee");
theList.push("Hello my name is garrett yee");
theList.push("Hello my name is kenny");
theList.push("Hello my name is garrett");
theList.push("Hello my name is garrett");
theList.push("Hello my name is kenny");
theList.push("Hello my name is kenny");
theList.push("Hello my name is kenny lol");
theList.push("Hello my name is kenny lol");
theList.push("Hello my name is kenny lol");
theList.push("Hello my name is kenny lol");
theList.push("Hello my name is garrett yee");
theList.push("Hello my name is garrett yee");
theList.push("dude my name is kenny");
theList.push("dude my name is kenny lol");
theList.push("dude my name is kenny lol");
theList.push("dude my name is kenny lol");
theList.push("dude my name is kenny lol");
theList.push("dude my name is garrett yee");
theList.push("dude my name is garrett yee");

var tokenized = [];
var index;
for(index = 0; index < theList.length; index++)
{
  theList[index] = theList[index].toLowerCase();

  var words = theList[index].split(" ");
  tokenized.push(words);
}

for(index = 0; index < tokenized.length; index++)
{
  var cur = head;
  var j;
  for(j = 0; j < tokenized[index].length; j++)
  {
    var child = cur.findChildNode(tokenized[index][j]);
    if(child != null)
    {
      console.info("Found child node");
      cur = child;
    }
    else
    {
      console.info("No child node, creating one");
      var newChild = new TrieNode(tokenized[index][j]);
      cur.children.add(newChild);
      cur = newChild;
    }
    cur.amtFinishes++;
  }
  console.info(cur.amtFinishes);
}

Recommend("", head);

const preTrainedTrie = new TrieNode("");

const Recommender = sentance => Recommend(sentance, head);

export default Recommender;
