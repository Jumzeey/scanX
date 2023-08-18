import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import Routes from './routes'
import './App.scss'
import './antdOverride.scss'
import store from './redux'

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes />
      </Router>
    </Provider>
  )
}

export default App
