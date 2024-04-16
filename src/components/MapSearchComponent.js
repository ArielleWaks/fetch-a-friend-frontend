import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

class MapSearch extends Component {
  state = {
    clients: []
  };

  async componentDidMount() {
    try {
      const response = await fetch('/clients'); // Assuming this endpoint fetches client data
      const body = await response.json();
      this.setState({ clients: body });
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  }

  render() {
    const { clients } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-intro">
            <h2>Let's Fetch A Friend</h2>
            {clients.map(client =>
              <div key={client.id}>
                {/* Render client data here */}
                {/* For example: {client.name} ({client.email}) */}
              </div>
            )}
          </div>
        </header>
      </div>
    );
  }
}

export default MapSearch;