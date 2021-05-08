import React from "react";

class TitleBar extends React.Component {
  render() {
    return (
      <header className="title-bar">
        <div>
          <span>{/* icon */}</span>
          <ul style={{margin: 0}}>{/* menu */}</ul>
          <span>title</span>
        </div>
        <div>

        </div>
      </header>
    );
  }
}

export default TitleBar;
