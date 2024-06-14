
import '../node_modules/bootstrap/dist/css/bootstrap-grid.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home , Login , Register,Dashborad,Posts ,UserProfile} from './components';
function App() {
  return (
 <>
 <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Dashborad" element={<Dashborad />} />
        <Route path="/Posts" element={<Posts />} />
        <Route path="/UserProfile" element={<UserProfile />} />
      </Routes>
    </Router>
 </>
  );
}

export default App;
