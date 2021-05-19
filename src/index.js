import React from 'react';
import ReactDOM from 'react-dom';

import 'index.scss';

import Application from 'components/Application';

import axios from 'axios';

// Configure the default base URL to point to the Heroku API server (production server)
if (process.env.REACT_APP_API_BASE_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
}

ReactDOM.render(<Application />, document.getElementById('root'));
