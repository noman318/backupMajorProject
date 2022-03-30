import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loader = () => {
  return (
    <Spinner 
    animation='border' 
    role='status' 
    style={{width:'40px', height:'40px', margin:'auto', display:'block'}}>
    <b><span className='sr-only'> Loading..</span></b>
    </Spinner>
  )
}

export default Loader
