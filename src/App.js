import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Postings
 from './pages/Postings';
function App() {
  return (
    <div className="App">
      <Login />
      <Signup />
      <Postings />
    </div>
  );
}

export default App;
