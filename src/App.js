import {Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  state = {
    clients: []
  };

  async componentDidMount() {
    const response = await fetch('/clients');
    const body = await response.json();
    this.setState({clients: body});
  }

  render() {
    const {clients} = this.state;
    return (
        <div className="App">
          <header className="App-header">
            <div className="App-intro">
              <h2>Let's Fetch A Friend</h2>
              {clients.map(client =>
                  <div key={client.id}>
                    {/* {client.name} ({client.email}) */}
                  </div>
              )}
            </div>
          </header>
        </div>
    );
  }
}
export default App;