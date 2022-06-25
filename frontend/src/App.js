import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react'

const axios = require('axios');



const getdata = async () => {
  const data = await axios.get('/api/books');
  console.log(data);

};

function App() {

  useEffect(() => {

    getdata()

  });

  return (

    <div className="App">
      <table>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Gender</th>
        </tr>
        <tr>
          <td>Anom</td>
          <td>19</td>
          <td>Male</td>
        </tr>
        <tr>
          <td>Megha</td>
          <td>19</td>
          <td>Female</td>
        </tr>
        <tr>
          <td>Subham</td>
          <td>25</td>
          <td>Male</td>
        </tr>
      </table>
    </div>
  );
}




export default App;
