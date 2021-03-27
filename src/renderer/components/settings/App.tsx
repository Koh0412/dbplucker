import React from 'react';
import ConnectForm from './ConnectForm';

class App extends React.Component {
  constructor(props: {}) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <>
        <div className="fav-list card">favorite</div>
        <ConnectForm />
      </>
    );
  }
}

export default App;
