import React from 'react';
import './App.css';
import Recommender from './RecommendInJavaScript';



class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
       isSpeaking: false,
       recommendation: '',
       SpeechRecognizer: this.getSpeechRecognizer(),
    };
  }

  getSpeechRecognizer = () => {
    const SpeechRecognizer = new window.webkitSpeechRecognition();
    SpeechRecognizer.continuous = true;

    SpeechRecognizer.onend = () => {
      this.setState({ isFetching: false });
    };

    SpeechRecognizer.onresult = (event) => {
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const result = event.results[i][0].transcript;
          console.log(result);
          this.setState({ isSpeaking: false, recommendation: Recommender(result) });
        }
        SpeechRecognizer.stop();
      }
    }

    return SpeechRecognizer;
  }


  getTextFromSpeech = () => {
    const {
      isSpeaking,
      SpeechRecognizer,
     } = this.state;

    this.setState({ isSpeaking: !isSpeaking });

    if (isSpeaking) {
      SpeechRecognizer.stop();
    } else {
      SpeechRecognizer.start();
    }
  }

  render() {
    const {
      isSpeaking,
      recommendation,
     } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h1> Predict the next lyrics! </h1>
          <div className={`icon ${isSpeaking ? 'voice-input-active' : ''}` } onClick={this.getTextFromSpeech}>
            <i className="fas fa-microphone-alt" />
          </div>
          {
            recommendation &&
            <React.Fragment>
              <h3> The next word is: </h3>
              <p> { recommendation } </p>
            </React.Fragment>
          }
          {
            recommendation === null &&
            <h3> Sorry, no recommendations at this time. </h3>
          }
        </div>
      </div>
    );
  }
}


export default App;
