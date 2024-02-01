// pages/index.tsx

import React, { useEffect, useState } from 'react'
// import { DocType, DocsMeta } from '../src/mongo/mongo'
type DocsMeta = any
type DocType = any

const ListItem = ({ data, docId }: { data: DocsMeta; docId: string }) => {
  return null
  ;<li className="my-2 w-full rounded bg-white px-6 py-4 shadow-md">
    <h2 className="mb-2 text-xl font-semibold">
      <a
        href={`https://www.legis.md/cautare/getResults?doc_id=${docId}&lang=ro`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800"
      >
        {data.denumire_actuala}
      </a>
    </h2>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <p>
        <strong>Previous Name:</strong> {data.denumire_precedenta}
      </p>
      <p>
        <strong>Type:</strong> {data.tipul}
      </p>
      <p>
        <strong>Date Adopted:</strong> {data.data_adoptarii}
      </p>
      <p>
        <strong>Date Published:</strong> {data.data_publicarii}
      </p>
      <p>
        <strong>Publication Method:</strong> {data.modalitatea_publicarii}
      </p>
      <p>
        <strong>Effective Date:</strong> {data.data_intrarii_in_vigoare}
      </p>
      <p>
        <strong>Date Modified:</strong> {data.data_modificarii}
      </p>
      <p>
        <strong>Date Abrogated:</strong> {data.data_abrogarii}
      </p>
      <p>
        <strong>Issuing Authority:</strong> {data.autoritatea_emitenta}
      </p>
    </div>
  </li>
}

const IndexPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocType[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/latest')
      const data = await response.json()

      console.log({ data })

      setDocuments(data)
    }
    fetchData()
  }, [])

  return (
    <div className="container mx-auto px-4">
      <h1 className="my-8 text-3xl font-semibold">Documents</h1>
      <ul className="space-y-4">
        {documents.map((document, index) => {
          if ('error' in document) return <p>aaaaaaaa</p>
          else return <ListItem key={index} data={document.contentdoc} docId={document.id} />
        })}
      </ul>
    </div>
  )
}

export default IndexPage
