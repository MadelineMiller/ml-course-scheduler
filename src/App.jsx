import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage';
import './App.css';
import Articles from "./pages/timeline";
import About from "./pages/about";
import axios from 'axios';

function App() {
  // State and worker initialization
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const generate = async () => {
    setLoading(true);
    console.log("generating..");
    try {
        const response = await axios.post('http://localhost:5001/recommend-classes');

        if (response.data) {
            setOutput(response.data);
        } else {
            setOutput('No response from server.');
        }
    } catch (error) {
        console.error('Error generating text:', error);
        setOutput('Error: Unable to generate text.');
    } finally {
        setLoading(false);
    }
    console.log("done generating..");
    console.log(output);
};

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Homepage
              generate={generate}
              loading={loading}
              output={output}
            />
          }
          
        />
       <Route path="/timeline" element={<Articles />} />
       <Route path="/about" element={<About />} />

        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
