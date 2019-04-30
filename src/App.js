import React from 'react';
import './App.css';


class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
       isSpeaking: false,
       isFetching: false,
       recognizedText: '',
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
          this.setState({
            isSpeaking: false,
            recognizedText: event.results[i][0].transcript,
          })
        }
        SpeechRecognizer.stop();
      }
    }

    return SpeechRecognizer;
  }


  getTextFromSpeech = () => {
    const {
      isSpeaking,
      isFetching,
      recognizedText,
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
      isFetching,
      recognizedText,
      SpeechRecognizer,
     } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h1> Predict the next lyrics! </h1>
            <div className={`icon ${isSpeaking ? 'voice-input-active' : ''}` } onClick={this.getTextFromSpeech}>
              <i className="fas fa-microphone-alt" />
            </div>
          {
            recognizedText &&
            <React.Fragment>
              <h3> Recognized text </h3>
              <p> { recognizedText } </p>
            </React.Fragment>
          }
        </div>
      </div>
    );
  }
}


export default App;
