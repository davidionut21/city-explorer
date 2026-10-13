
export const getScumpe = (list) =>
  list.filter((o) => o.pret > 400)

export const costTotal = (list) =>
  list.reduce((total, o) => total + o.pret, 0)

export const formatOras = ({ oras, tara, pret }) =>
  `${oras}, ${tara} - ${pret} euro (${pret > 400 ? 'scump' : 'accesibil'})`

export const costPeTara = (list) =>
  list.reduce(
    (acc, { tara, pret }) => ({ ...acc, [tara]: (acc[tara] ?? 0) + pret }),
    {}
  )

export const scadePret = (list, id, reducere) =>
  list.map((o) =>
    o.id === id ? { ...o, pret: o.pret - reducere } : o
  )

export const adaugaOras = (list, oras) => [...list, oras]

export const stergeOras = (list, id) =>
  list.filter((o) => o.id !== id)
