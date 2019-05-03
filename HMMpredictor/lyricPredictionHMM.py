import string
import numpy as np

# Path of the text file containing the training data
training_data_file = 'kenny.txt'


def stripPunctuation(sentence):
    return sentence.translate(str.maketrans('','', string.punctuation))

#converts list of words to probabilites
def convertToProbabilityDict(given_list):
    probability_dict = {}
    given_list_length = len(given_list)
    for item in given_list:
        probability_dict[item] = probability_dict.get(item, 0) + 1
    for key, value in probability_dict.items():
        probability_dict[key] = value / given_list_length
    return probability_dict

#check if key is in dictionary and add value(word)
def addToDict(dictionary, key, value):
    if key not in dictionary:
        dictionary[key] = []
    dictionary[key].append(value)

initial_word = {}
stored_words = {}
second_word = {}
transitions = {}

# Trains HMM using text file
def trainHMM():
    for line in open(training_data_file):
        tokens = stripPunctuation(line.rstrip().lower()).split()
        tokens_length = len(tokens)
        for i in range(tokens_length):
            token = tokens[i]
            if i == 0:
                initial_word[token] = initial_word.get(token, 0) + 1
            else:
                prev_token = tokens[i - 1]
                if i == tokens_length - 1:
                    addToDict(transitions, (prev_token, token), 'END')
                if i == 1:
                    addToDict(second_word, prev_token, token)
                else:
                    prev_prev_token = tokens[i - 2]
                    addToDict(transitions, (prev_prev_token, prev_token), token)
    
    # Normalize the distributions
    initial_word_total = sum(initial_word.values())
    for key, value in initial_word.items():
        initial_word[key] = value / initial_word_total
        
    for prev_word, next_word_list in second_word.items():
        second_word[prev_word] = convertToProbabilityDict(next_word_list)
        
    for word_pair, next_word_list in transitions.items():
        transitions[word_pair] = convertToProbabilityDict(next_word_list)
    
    print('Training successful.')

#train the model using text file
trainHMM()

def sample_word(dictionary):
    #choose a random value between 0 and 1, use this to pick a key based of probability of the keys value
    randProb = np.random.random()
    cumulative = 0
    for key, value in dictionary.items():
        #keep adding probablity till cumulative probabilites add to more than randProb random number
        cumulative += value
        if randProb < cumulative:
            return key
    assert(False)

#get a key from a given word
def getKeyForWord1(word):
    for key, value in initial_word.items():
        if word == value:
            return key

    return "key doesn't exist"


# Function to predict sample text
def predict(word0):
    sentence = []
    sentence.append(word0)
    # Second word
    try:
        word1 = sample_word(second_word[word0])
    except:
        print('word not in dictionary, enter a new word')
        return
    sentence.append(word1)
    # Subsequent words until END
    while True:
        word2 = sample_word(transitions[(word0, word1)])
        if word2 == 'END':
            break
        sentence.append(word2)
        word0 = word1
        word1 = word2
    print(' '.join(sentence))

#get user input and call predict method
while True:
    # Get user input for initial word
    word0 = input("Enter a word/phrase or stop! to stop: ")
    #just get final word from user input
    word0 = word0.split()[-1]
    if(word0 == "stop!"):
        break
    predict(word0)

