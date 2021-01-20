import './App.css';

import React from 'react';
import Header from './components/Header/header';
import RegForm from './components/RegistrationForm/register';

class App extends React.Component {
  render(){
    return (
      <div className="App">
        <Header />
        <RegForm />
      </div>
    );
  }
}

export default App;
