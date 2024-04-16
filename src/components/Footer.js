import React from 'react'

function Footer() {
  return (
    <footer>
        <p style={{  padding: ".5rem 7rem", textAlign: 'center', backgroundColor: 'gray', color: 'white', fontWeight: 300}}>
             Document management system, FON&copy; { new Date().getFullYear()}  </p>
    </footer>
  )
}

export default Footer