import React from 'react';
import './App.css';
import Recommender from './RecommendInJavaScript';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       isSpeaking: false,
       recommendation: '',
       useIntelligence: false,
       SpeechRecognizer: this.initSpeechRecognizer(),
    };
  }

  animateCircuit = () => {
    const lines = document.querySelectorAll('.st0');
    const circles = document.querySelectorAll('.st1');

    if (!this.state.useIntelligence) {
      [].forEach.call(lines, function(path) {
        var length = path.getTotalLength();
        path.style.transition = path.style.WebkitTransition = 'none';
        path.style.strokeDasharray = length + ' ' + length;
        path.style.strokeDashoffset = length;
        path.getBoundingClientRect();
        path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 2s ease-in-out';
        path.style.stroke = '#61dafb';
        path.style.strokeDashoffset = '0';
      });

      [].forEach.call(circles, function(path) {  path.style.stroke = '#61dafb'; })
    } else {
      [].forEach.call(lines, function(path) { path.style.stroke = 'transparent'; });
      [].forEach.call(circles, function(path) {  path.style.stroke = 'transparent'; });
    }


  }

  useIntelligence = () => {
    this.animateCircuit();
    this.setState({ useIntelligence: !this.state.useIntelligence, recommendation: '' });
  }

  initSpeechRecognizer = () => {
    const SpeechRecognizer = new window.webkitSpeechRecognition();
    SpeechRecognizer.continuous = true;

    SpeechRecognizer.onend = () => this.setState({ isFetching: false });

    SpeechRecognizer.onresult = event => {
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const result = event.results[i][0].transcript;
          console.log(result);

          if (this.state.useIntelligence) {
            fetch('https://gauravkg15.pythonanywhere.com/hmm_predict?token=api_response')
              .then(res => res.json())
              .then(res => this.setState({ isSpeaking: false, recommendation: res.response }))
          } else {
            this.setState({ isSpeaking: false, recommendation:  Recommender(result) });
          }
        }
        SpeechRecognizer.stop();
      }
    }

    return SpeechRecognizer;
  }


  getTextFromSpeech = () => {
    const { isSpeaking, SpeechRecognizer } = this.state;
    this.setState({ isSpeaking: !isSpeaking });

    if (isSpeaking) {
      SpeechRecognizer.stop();
    } else {
      SpeechRecognizer.start();
    }
  }

  render() {
    const { isSpeaking, recommendation, useIntelligence } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h1> Predict the next lyrics! </h1>
          <h3
            onClick={this.useIntelligence}
            className="toggle-intelligence"
          >
            { useIntelligence ? 'Use naive' : 'Use intelligence'}
           </h3>
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
