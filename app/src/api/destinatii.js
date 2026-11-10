
const parametri = new URLSearchParams(window.location.search)

const API_URL = parametri.has('mare')
  ? 'http://localhost:3002'
  : 'http://localhost:3001'

const FARA_PAGINARE = parametri.has('nepaginat')

export async function getDestinatii(pagina = 1) {
  const cale = FARA_PAGINARE
    ? '/destinatii'
    : `/destinatii?_page=${pagina}&_per_page=20`

  const response = await fetch(`${API_URL}${cale}`)

  if (!response.ok) {
    throw new Error(`Serverul a răspuns cu ${response.status}`)
  }

  const rezultat = await response.json()

  if (FARA_PAGINARE) {
    return {
      data: rezultat,
      pages: 1,
      items: rezultat.length,
    }
  }

  return rezultat
}

export async function postDestinatie(destinatie) {
  const response = await fetch(`${API_URL}/destinatii`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(destinatie),
  })

  if (!response.ok) {
    throw new Error(`Serverul a răspuns cu ${response.status}`)
  }

  return response.json()
}

export async function patchVizitat(id, vizitat) {
  const response = await fetch(`${API_URL}/destinatii/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vizitat }),
  })

  if (!response.ok) {
    throw new Error(`Serverul a răspuns cu ${response.status}`)
  }

  return response.json()
}
