
import { useState } from 'react'

export default function FormularDestinatie({ onAdd }) {
  const [oras, setOras] = useState('')
  const [tara, setTara] = useState('')
  const [zile, setZile] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!oras.trim() || !tara.trim() || !zile || Number(zile) < 1) {
      return
    }

    onAdd({
      id: crypto.randomUUID(),
      oras: oras.trim(),
      tara: tara.trim(),
      zile: Number(zile),
      vizitat: false,
    })

    setOras('')
    setTara('')
    setZile('')
  }

  return (
    <form className="formular" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Oraș"
        aria-label="Oraș"
        value={oras}
        onChange={(event) => setOras(event.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Țară"
        aria-label="Țară"
        value={tara}
        onChange={(event) => setTara(event.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Zile"
        aria-label="Zile"
        min="1"
        step="1"
        value={zile}
        onChange={(event) => setZile(event.target.value)}
        required
      />
      <button type="submit">Adaugă</button>
    </form>
  )
}
