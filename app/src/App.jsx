
import { useEffect, useState } from 'react'
import {
  getDestinatii,
  postDestinatie,
  patchVizitat,
} from './api/destinatii.js'
import {
  getNevizitate,
  totalZile,
} from './utils/destinatii.js'
import Rezumat from './components/Rezumat.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import Cautare from './components/Cautare.jsx'
import PanouStatistici from './components/PanouStatistici.jsx'
import './App.css'

export default function App() {
  const [destinatii, setDestinatii] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)
  const [seTrimite, setSeTrimite] = useState(false)
  const [cautare, setCautare] = useState('')
  const [pagina, setPagina] = useState(1)
  const [totalPagini, setTotalPagini] = useState(1)

  const arataStatistici = new URLSearchParams(
    window.location.search
  ).has('statistici')

  useEffect(() => {
    let activ = true

    async function incarca() {
      setIncarcare(true)
      setEroare(null)

      try {
        const rezultat = await getDestinatii(pagina)

        if (activ) {
          setDestinatii(rezultat.data)
          setTotalPagini(rezultat.pages || 1)
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
  }, [pagina])

  async function handleToggle(id) {
    const destinatie = destinatii.find((d) => d.id === id)

    if (!destinatie) {
      return
    }

    try {
      const salvata = await patchVizitat(
        id,
        !destinatie.vizitat
      )

      setDestinatii((curent) =>
        curent.map((d) =>
          d.id === id ? salvata : d
        )
      )
    } catch (error) {
      setEroare(error.message)
    }
  }

  async function handleAdd(destinatie) {
    setSeTrimite(true)

    try {
      const salvata = await postDestinatie(destinatie)

      setDestinatii((curent) => [...curent, salvata])

      return true
    } catch (error) {
      setEroare(error.message)
      return false
    } finally {
      setSeTrimite(false)
    }
  }

  const nevizitate = getNevizitate(destinatii)
  const text = cautare.trim().toLowerCase()

  const afisate = destinatii.filter(
    (d) =>
      d.oras.toLowerCase().includes(text) ||
      d.tara.toLowerCase().includes(text)
  )

  return (
    <main>
      <h1>City Explorer</h1>

      {arataStatistici && <PanouStatistici />}

      {incarcare ? (
        <p className="stare">
          Se încarcă destinațiile...
        </p>
      ) : eroare ? (
        <p className="stare eroare">
          A apărut o eroare: {eroare}
        </p>
      ) : (
        <>
          <Rezumat
            total={destinatii.length}
            nevizitate={nevizitate.length}
            zile={totalZile(nevizitate)}
          />

          <FormularDestinatie
            onAdd={handleAdd}
            seTrimite={seTrimite}
          />

          <Cautare
            valoare={cautare}
            onChange={setCautare}
          />

          {destinatii.length === 0 ? (
            <p className="gol">
              Nu există destinații. Adaugă prima destinație
              folosind formularul.
            </p>
          ) : afisate.length === 0 ? (
            <p className="gol">
              Niciun rezultat pentru «{cautare.trim()}».
            </p>
          ) : (
            <ListaDestinatii
              destinatii={afisate}
              onToggle={handleToggle}
            />
          )}

          <div className="paginare">
            <button
              type="button"
              disabled={pagina === 1}
              onClick={() => setPagina((p) => p - 1)}
            >
              Înapoi
            </button>

            <span>
              pagina {pagina} din {totalPagini}
            </span>

            <button
              type="button"
              disabled={pagina >= totalPagini}
              onClick={() => setPagina((p) => p + 1)}
            >
              Înainte
            </button>
          </div>
        </>
      )}
    </main>
  )
}
