import { useEffect, useState } from 'react'
import { getStatistici } from '../api/statistici.js'

export default function PanouStatistici({
  actualizare = 0,
}) {
  const [prag, setPrag] = useState('3')
  const [tara, setTara] = useState('')
  const [statistici, setStatistici] = useState(null)
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)

  useEffect(() => {
    let activ = true

    async function incarca() {
      setIncarcare(true)
      setEroare(null)

      try {
        const date = await getStatistici(prag, tara)

        if (activ) {
          setStatistici(date)
        }
      } catch (error) {
        if (activ) {
          setEroare(error.message)
        }
      } finally {
        if (activ) {
          setIncarcare(false)
        }
      }
    }

    incarca()

    return () => {
      activ = false
    }
  }, [prag, tara, actualizare])

  return (
    <section className="panou">
      <h2>Statistici</h2>

      <label>
        Cel puțin{' '}
        <input
          type="number"
          min="1"
          value={prag}
          onChange={(event) =>
            setPrag(event.target.value)
          }
        />{' '}
        zile
      </label>

      {' '}

      <label>
        Țara{' '}
        <input
          type="text"
          placeholder="Toate"
          value={tara}
          onChange={(event) =>
            setTara(event.target.value)
          }
        />
      </label>

      {incarcare ? (
        <p className="stare">
          Se încarcă statisticile...
        </p>
      ) : eroare ? (
        <p className="stare eroare">
          Statistici indisponibile: {eroare}
        </p>
      ) : statistici && statistici.destinatii === 0 ? (
        <p className="gol">
          Nicio destinație pentru criteriile selectate.
        </p>
      ) : statistici ? (
        <ul>
          <li>
            Destinații: {statistici.destinatii}
          </li>
          <li>
            Total zile: {statistici.zile}
          </li>
          <li>
            Media: {statistici.medie.toFixed(1)} zile
          </li>
        </ul>
      ) : null}
    </section>
  )
}