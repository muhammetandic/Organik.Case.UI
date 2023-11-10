import './App.css'

function App() {
  return (
    <>
      <h1>Sisteme giriş yaptınız</h1>
      <div className="card">
        <button onClick={() => window.location.href = '/'}>Çıkış</button>
      </div>
    </>
  )
}

export default App
