import React from 'react';
import './App.css';

//React
var timeout;
var timeout2;

class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      current: "Session",
      going: false,
      sessionTime: null,
      breakTime: null,
      displayTime: ["00", "00"]
    }
    this.handleBreak = this.handleBreak.bind(this);
    this.handleSession = this.handleSession.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.countdownSession = this.countdownSession.bind(this);
    this.countdownBreak = this.countdownBreak.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.alarm = this.alarm.bind(this);
    this.reset = this.reset.bind(this);
  }

  handleStart() {
    let sessionSeconds;
    let breakSeconds;
    let minutes;
    let seconds;
    if (this.state.displayTime[0] === "00" && this.state.displayTime[1] === "00") {
      sessionSeconds = this.state.sessionLength*60;
      breakSeconds = this.state.breakLength*60;
    } else {
      if (this.state.current === "Session") {
        minutes = parseInt(this.state.displayTime[0]);
        seconds = parseInt(this.state.displayTime[1]);
        sessionSeconds = minutes*60 + seconds;
        breakSeconds = this.state.breakLength*60;
      } else if (this.state.current === "Break") {
        minutes = parseInt(this.state.displayTime[0]);
        seconds = parseInt(this.state.displayTime[1]);
        breakSeconds = minutes*60 + seconds;
        sessionSeconds = this.state.sessionLength*60;
      }
    }
    this.setState({
      going: !this.state.going,
      sessionTime: sessionSeconds,
      breakTime: breakSeconds
    }, () => {
      if (this.state.current === "Session") {
        this.countdownSession();
      } else {
        this.countdownBreak();
      }
    });
  }

  countdownSession() {
    if (this.state.going === false) {
      return;
    }
    if (this.state.sessionTime < 0) {
      this.setState({
        sessionTime: this.state.sessionLength*60
      });
      this.alarm();
      this.countdownBreak();
      return;
    }
    this.setState({
      current: "Session",
      sessionTime: this.state.sessionTime - 1,
      displayTime: [(Math.floor(this.state.sessionTime/60) < 10) ? ("0" + (Math.floor(this.state.sessionTime/60).toString())) : ((Math.floor(this.state.sessionTime/60).toString() + "0").slice(0, 2)), (Math.floor(this.state.sessionTime%60) < 10) ? ("0" + (Math.floor(this.state.sessionTime%60).toString())) : ((Math.floor(this.state.sessionTime%60).toString() + "0").slice(0, 2))]
    });
    timeout = setTimeout(this.countdownSession, 1000);
  }

  countdownBreak() {
    if (this.state.going === false) {
      return;
    }
    if (this.state.breakTime < 0) {
      this.setState({
        breakTime: this.state.breakLength*60
      });
      this.alarm();
      this.countdownSession();
      return;
    }
    this.setState({
      current: "Break",
      displayTime: [(Math.floor(this.state.breakTime/60) < 10) ? ("0" + (Math.floor(this.state.breakTime/60).toString())) : ((Math.floor(this.state.breakTime/60).toString() + "0").slice(0, 2)), (Math.floor(this.state.breakTime%60) < 10) ? ("0" + (Math.floor(this.state.breakTime%60).toString())) : ((Math.floor(this.state.breakTime%60).toString() + "0").slice(0, 2))],
      breakTime: this.state.breakTime - 1,
    });
    timeout2 = setTimeout(this.countdownBreak, 1000);
  }

  alarm() {
    document.getElementById("beep").play();
  }

  handleBreak(event) {
    if (event.target.innerHTML === "-" && this.state.breakLength < 2) {
     return;
    }
    if (event.target.innerHTML === "+" && this.state.breakLength > 59) {
      return;
    }
    if (event.target.innerHTML === "+") {
      this.setState({
        breakLength: this.state.breakLength + 1
      });
    } else {
      this.setState({
        breakLength: this.state.breakLength - 1
      });
    }
  }

  handleSession(event) {
    if (event.target.innerHTML === "-" && this.state.sessionLength < 2) {
     return;
    }
    if (event.target.innerHTML === "+" && this.state.sessionLength > 59) {
      return;
    }
    if (event.target.innerHTML === "+") {
      this.setState({
        sessionLength: this.state.sessionLength + 1
      });
    } else {
      this.setState({
        sessionLength: this.state.sessionLength - 1
      });
    }
  }

  handleStop() {
    this.setState({
      going: !this.state.going
    });
  }

  reset() {
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
    clearTimeout(timeout);
    clearTimeout(timeout2);
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      current: "Session",
      going: false,
      sessionTime: undefined,
      breakTime: undefined,
      displayTime: ["00", "00"]
    });
  }

  render() {
    var start = <button id="start_stop" onClick={this.handleStart}>Start</button>;
    var stop = <button id="start_stop" onClick={this.handleStop}>Stop</button>
    return(
      <div id="wrapper">
        <div className="imagecontainer">
          <img alt="leaf" className="leaf" src="https://image.flaticon.com/icons/svg/704/704834.svg" />
        </div>
        <div className="maincontainer">
          <header className="header">
            <h1 id="header">Pomodoro Clock</h1>
          </header>
          <div className="inputdivs">
            <div className="inputdiv1">
              <h3 id="session-label">Session length:</h3>
              <div onClick={this.handleSession} className="minus">
                <h1 id="session-decrement">-</h1>
              </div>
              <h1 id="session-length">{this.state.sessionLength}</h1>
              <div onClick={this.handleSession} className="plus">
                <h1 id="session-increment">+</h1>
              </div>
            </div>
            <div className="inputdiv2">
              <h3 id="break-label">Break length:</h3>
              <div onClick={this.handleBreak} className="minus">
                <h1 id="break-decrement">-</h1>
              </div>
              <h1 id="break-length">{this.state.breakLength}</h1>
              <div onClick={this.handleBreak} className="plus">
                <h1 id="break-increment">+</h1>
              </div>
            </div>
          </div>
          <div className="clock">
            <h1 id="time-left">{this.state.displayTime[0] + ":" + this.state.displayTime[1]}</h1>
            <audio id="beep" src="http://soundbible.com/mp3/Fire_pager-jason-1283464858.mp3"/>
            <hr />
            <h2 id="timer-label">{this.state.current}</h2>
          </div>
          <div id="footer">
            <div className="start-stop">
              {this.state.going ? stop : start}
            </div>
            <div className="reset">
              <button id="reset" onClick={this.reset}>Reset</button>
              <h1>{this.state.breaktime}</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Pomodoro;
