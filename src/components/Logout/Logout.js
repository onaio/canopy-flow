import React from 'react';
import { MenuItem, Glyphicon } from 'react-bootstrap';

class Logout extends React.Component {
  render() {
    const { onLogoutClick } = this.props;
    return (
      <MenuItem eventKey={3.1} onClick={() => onLogoutClick()}>
        <Glyphicon glyph="log-out" />
      Logout
      </MenuItem>
    );
  }
}

export default Logout;
