import React from 'react';
import ConnectForm from './ConnectForm';

class App extends React.Component {
  constructor(props: {}) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <>
        <h3>Connect Database</h3>
        <ConnectForm />
      </>
    );
  }
}

export default App;
