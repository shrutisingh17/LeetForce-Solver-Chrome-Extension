import { useState } from 'react'
import HomePage from './components/HomePage'
import SettingsPage from './components/Settings/SettingsPage'

function App() {
  const [openSetting, setOpenSetting] = useState(false);

  return (
    <div className='w-96 p-6 m-2 bg-gray-50 rounded-lg shadow-2xl'>
      {openSetting ? <SettingsPage setOpenSetting = {setOpenSetting} /> :
      <HomePage setOpenSetting = {setOpenSetting} />
      }
    </div>
  )
}

export default App