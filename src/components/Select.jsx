import { useContext, useState } from 'react'
import Proptypes from 'prop-types'
import { StoreContext } from '../context/storeContext'

const Select = ({ name, options, k, v }) => {
  const [value, setValue] = useState(v)
  console.debug(value)
  const { settingStore } = useContext(StoreContext)
  const handleSelect = e => {
    setValue(e.target.value)
    settingStore.updateSettings({ key: k, value: e.target.value })
  }
  return (
    <div className="item flex px-6 py-4 text-text">
      <div className="left font-light text-base flex-1 flex items-center">
        {name}
      </div>
      <div className="right flex-1 flex justify-end items-center">
        <select
          className="bg-secondary-bg-transparent min-w-36 px-3 py-2 rounded-lg appearance-none outline-none"
          value={value}
          onChange={handleSelect}
        >
          {options.map(({ value, label }) => {
            return (
              <option value={value} key={value}>
                {label}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}

Select.propTypes = {
  name: Proptypes.string,
  options: Proptypes.array,
  k: Proptypes.string,
  v: Proptypes.string,
}

export default Select
