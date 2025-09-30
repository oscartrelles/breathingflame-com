/*
 Admin QA: Firestore ↔ en.json parity checker
 - Reads Firestore via Admin SDK (read-only service account from env)
 - Loads latest exported JSON from src/content/en.json (repo convention)
 - Normalizes and deep-compares collections by id/slug and selected singletons
 - Writes JSON + Markdown summary reports to public/data/
*/

import fs from 'fs'
import path from 'path'
import process from 'process'
import { fileURLToPath } from 'url'
import admin from 'firebase-admin'
import { initializeApp as initializeClientApp, getApps as getClientApps } from 'firebase/app'
import { getFirestore as getClientFirestore, collection as clientCollection, getDocs as clientGetDocs, doc as clientDoc, getDoc as clientGetDoc } from 'firebase/firestore'
import dotenv from 'dotenv'

type JsonValue = any

type DiffEntryMissing = { collection: string; id: string; path: string }
type DiffEntryMismatch = {
  collection: string
  id: string
  fieldPath: string
  firestoreValue: JsonValue
  jsonValue: JsonValue
}
type DiffEntryExtraField = { collection: string; id: string; fieldPath: string }

type ParityReport = {
  summary: {
    timestamp: string
    projectId: string | null
    enJsonPath: string
    collectionsChecked: string[]
    totals: {
      missingInJson: number
      missingInFirestore: number
      fieldMismatches: number
      extraFieldsInJson: number
    }
  }
  missingInJson: DiffEntryMissing[]
  missingInFirestore: DiffEntryMissing[]
  fieldMismatches: DiffEntryMismatch[]
  extraFieldsInJson: DiffEntryExtraField[]
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getEnv(varName: string): string | null {
  const value = process.env[varName]
  return value && value.length > 0 ? value : null
}

function initFirebaseAdmin(): boolean {
  // Load env from .env.local if present
  try {
    dotenv.config({ path: path.join(process.cwd(), '.env.local') })
  } catch {
    // ignore
  }

  // Support GOOGLE_APPLICATION_CREDENTIALS (service account file path)
  const gacPath = getEnv('GOOGLE_APPLICATION_CREDENTIALS')
  if (gacPath && fs.existsSync(gacPath)) {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      })
    }
    return true
  }

  const projectId = getEnv('FIREBASE_PROJECT_ID')
  const clientEmail = getEnv('FIREBASE_CLIENT_EMAIL')
  let privateKey = getEnv('FIREBASE_PRIVATE_KEY')
  const privateKeyB64 = getEnv('FIREBASE_PRIVATE_KEY_BASE64')
  if (!privateKey && privateKeyB64) {
    try {
      privateKey = Buffer.from(privateKeyB64, 'base64').toString('utf8')
    } catch {
      // ignore
    }
  }

  if (!projectId || !clientEmail || !privateKey) {
    // Admin creds not available; allow caller to fall back to client SDK
    return false
  }

  // Handle escaped newlines in env var
  privateKey = privateKey.replace(/\\n/g, '\n')

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      } as admin.ServiceAccount),
    })
  }
  return true
}

function readEnJson(): any {
  // Repo uses src/content/en.json convention
  const enJsonPath = path.join(process.cwd(), 'src', 'content', 'en.json')
  if (!fs.existsSync(enJsonPath)) {
    throw new Error(`en.json not found at ${enJsonPath}`)
  }
  const raw = fs.readFileSync(enJsonPath, 'utf8')
  try {
    const parsed = JSON.parse(raw)
    return { data: parsed, path: enJsonPath }
  } catch (e) {
    throw new Error(`Failed to parse ${enJsonPath}: ${(e as Error).message}`)
  }
}

async function fetchFirestoreCollectionsAdmin() {
  const db = admin.firestore()

  // Core collections expected in both Firestore and en.json
  const collections = ['pages', 'programs', 'experiences', 'solutions', 'posts', 'testimonials', 'navigation', 'settings', 'testimonialMappings', 'testimonialTags']
  const result: Record<string, any[]> = {}
  for (const name of collections) {
    const snap = await db.collection(name).get()
    result[name] = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }

  // Singletons (may not all exist in JSON; parity will flag)
  const singletons = [
    'pageHome',
    'pageAbout',
    'pageIndividuals',
    'pageOrganizations',
    'pagePrograms',
    'pageEvents',
    'pageResources',
    'pageTestimonials',
    'pageContact',
    'pageCommunity',
    'pagePress',
    'navigation',
    'settings',
  ]
  const singletonValues: Record<string, any> = {}
  for (const s of singletons) {
    const ref = db.collection('singletons').doc(s)
    const doc = await ref.get()
    if (doc.exists) singletonValues[s] = { id: doc.id, ...doc.data() }
  }
  return { collections: result, singletons: singletonValues }
}

async function fetchFirestoreCollectionsClient() {
  // Load env
  const apiKey = getEnv('VITE_FIREBASE_API_KEY') || getEnv('FIREBASE_API_KEY')
  const authDomain = getEnv('VITE_FIREBASE_AUTH_DOMAIN') || getEnv('FIREBASE_AUTH_DOMAIN')
  const projectId = getEnv('VITE_FIREBASE_PROJECT_ID') || getEnv('FIREBASE_PROJECT_ID')
  const storageBucket = getEnv('VITE_FIREBASE_STORAGE_BUCKET') || getEnv('FIREBASE_STORAGE_BUCKET')
  const messagingSenderId = getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || getEnv('FIREBASE_MESSAGING_SENDER_ID')
  const appId = getEnv('VITE_FIREBASE_APP_ID') || getEnv('FIREBASE_APP_ID')

  if (!apiKey || !projectId) {
    throw new Error('Firebase client config missing. Set VITE_FIREBASE_* or FIREBASE_* env vars.')
  }

  const clientConfig = { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId }
  const app = getClientApps().length ? getClientApps()[0] : initializeClientApp(clientConfig as any)
  const db = getClientFirestore(app as any)

  const collections = ['pages', 'programs', 'experiences', 'solutions', 'posts', 'testimonials', 'navigation', 'settings', 'testimonialMappings', 'testimonialTags']
  const result: Record<string, any[]> = {}
  for (const name of collections) {
    const snap = await clientGetDocs(clientCollection(db as any, name))
    result[name] = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }

  const singletons = [
    'pageHome',
    'pageAbout',
    'pageIndividuals',
    'pageOrganizations',
    'pagePrograms',
    'pageEvents',
    'pageResources',
    'pageTestimonials',
    'pageContact',
    'pageCommunity',
    'pagePress',
    'navigation',
    'settings',
  ]
  const singletonValues: Record<string, any> = {}
  for (const s of singletons) {
    const ref = clientDoc(db as any, 'singletons', s)
    const docSnap = await clientGetDoc(ref)
    if (docSnap.exists()) singletonValues[s] = { id: docSnap.id, ...docSnap.data() }
  }
  return { collections: result, singletons: singletonValues }
}

function normalizeCollectionItems(items: any[]): Record<string, any> {
  const byId: Record<string, any> = {}
  if (!Array.isArray(items)) return byId
  for (const item of items) {
    const key = item.slug || item.id
    if (!key) continue
    byId[key] = item
  }
  return byId
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (a && b && typeof a === 'object') {
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) return false
      }
      return true
    }
    const aKeys = Object.keys(a).sort()
    const bKeys = Object.keys(b).sort()
    if (!deepEqual(aKeys, bKeys)) return false
    for (const k of aKeys) {
      if (!deepEqual(a[k], b[k])) return false
    }
    return true
  }
  return false
}

function diffObjects(
  collection: string,
  id: string,
  firestoreObj: any,
  jsonObj: any,
  basePath = ''
): { mismatches: DiffEntryMismatch[]; extrasInJson: DiffEntryExtraField[] } {
  const mismatches: DiffEntryMismatch[] = []
  const extrasInJson: DiffEntryExtraField[] = []

  const fKeys = new Set(Object.keys(firestoreObj || {}))
  const jKeys = new Set(Object.keys(jsonObj || {}))

  // Compare fields present in Firestore
  for (const key of fKeys) {
    const fVal = firestoreObj ? firestoreObj[key] : undefined
    const jVal = jsonObj ? jsonObj[key] : undefined
    const fieldPath = basePath ? `${basePath}.${key}` : key

    if (typeof fVal === 'object' && fVal !== null) {
      if (jVal === undefined) {
        mismatches.push({ collection, id, fieldPath, firestoreValue: fVal, jsonValue: undefined })
      } else if (typeof jVal !== 'object' || jVal === null) {
        mismatches.push({ collection, id, fieldPath, firestoreValue: fVal, jsonValue: jVal })
      } else {
        const nested = diffObjects(collection, id, fVal, jVal, fieldPath)
        mismatches.push(...nested.mismatches)
        extrasInJson.push(...nested.extrasInJson)
      }
    } else {
      if (!deepEqual(fVal, jVal)) {
        mismatches.push({ collection, id, fieldPath, firestoreValue: fVal, jsonValue: jVal })
      }
    }
  }

  // Fields that exist only in JSON
  for (const key of jKeys) {
    if (!fKeys.has(key)) {
      const fieldPath = basePath ? `${basePath}.${key}` : key
      extrasInJson.push({ collection, id, fieldPath })
    }
  }

  return { mismatches, extrasInJson }
}

async function main() {
  const hasAdmin = initFirebaseAdmin()
  const projectId = getEnv('FIREBASE_PROJECT_ID')
  const { data: enData, path: enPath } = readEnJson()

  let ffCollections: Record<string, any[]> = {}
  let ffSingletons: Record<string, any> = {}
  if (hasAdmin) {
    const adminData = await fetchFirestoreCollectionsAdmin()
    ffCollections = adminData.collections
    ffSingletons = adminData.singletons
  } else {
    console.warn('Admin credentials not available; using client SDK read-only.')
    const clientData = await fetchFirestoreCollectionsClient()
    ffCollections = clientData.collections
    ffSingletons = clientData.singletons
  }

  const collectionsToCheck = ['pages', 'programs', 'experiences', 'solutions', 'posts', 'testimonials', 'navigation', 'settings', 'testimonialMappings', 'testimonialTags']

  const missingInJson: DiffEntryMissing[] = []
  const missingInFirestore: DiffEntryMissing[] = []
  const fieldMismatches: DiffEntryMismatch[] = []
  const extraFieldsInJson: DiffEntryExtraField[] = []

  for (const coll of collectionsToCheck) {
    const fsItems = normalizeCollectionItems(ffCollections[coll] || [])
    const jsonItems = normalizeCollectionItems((enData?.[coll] as any[]) || [])

    const fsIds = new Set(Object.keys(fsItems))
    const jsonIds = new Set(Object.keys(jsonItems))

    // Missing in JSON
    for (const id of fsIds) {
      if (!jsonIds.has(id)) missingInJson.push({ collection: coll, id, path: `${coll}.${id}` })
    }

    // Missing in Firestore
    for (const id of jsonIds) {
      if (!fsIds.has(id)) missingInFirestore.push({ collection: coll, id, path: `${coll}.${id}` })
    }

    // Compare overlapping
    for (const id of [...fsIds].filter((x) => jsonIds.has(x))) {
      const fObj = fsItems[id]
      const jObj = jsonItems[id]
      const diffs = diffObjects(coll, id, fObj, jObj)
      fieldMismatches.push(...diffs.mismatches)
      extraFieldsInJson.push(...diffs.extrasInJson)
    }
  }

  // Compare singletons presence (optional): if present in either side, check basic shape
  const singletonKeys = Object.keys(ffSingletons)
  for (const key of singletonKeys) {
    const fsObj = ffSingletons[key]
    const jsonObj = enData?.[key]
    if (jsonObj === undefined) {
      missingInJson.push({ collection: 'singletons', id: key, path: key })
    } else {
      const diffs = diffObjects('singletons', key, fsObj, jsonObj)
      fieldMismatches.push(...diffs.mismatches)
      extraFieldsInJson.push(...diffs.extrasInJson)
    }
  }

  // JSON-only singletons
  const jsonSingletonCandidates = [
    'pageHome',
    'pageAbout',
    'pageIndividuals',
    'pageOrganizations',
    'pagePrograms',
    'pageEvents',
    'pageResources',
    'pageTestimonials',
    'pageContact',
    'pageCommunity',
    'pagePress',
    'navigation',
    'settings',
  ]
  for (const key of jsonSingletonCandidates) {
    if (enData?.[key] !== undefined && ffSingletons[key] === undefined) {
      missingInFirestore.push({ collection: 'singletons', id: key, path: key })
    }
  }

  const report: ParityReport = {
    summary: {
      timestamp: new Date().toISOString(),
      projectId,
      enJsonPath: enPath,
      collectionsChecked: collectionsToCheck,
      totals: {
        missingInJson: missingInJson.length,
        missingInFirestore: missingInFirestore.length,
        fieldMismatches: fieldMismatches.length,
        extraFieldsInJson: extraFieldsInJson.length,
      },
    },
    missingInJson,
    missingInFirestore,
    fieldMismatches,
    extraFieldsInJson,
  }

  const outDir = path.join(process.cwd(), 'public', 'data')
  fs.mkdirSync(outDir, { recursive: true })
  const jsonOut = path.join(outDir, 'parity.report.json')
  fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2), 'utf8')

  // Markdown summary
  const mdOut = path.join(outDir, 'parity.summary.md')
  const lines: string[] = []
  lines.push(`# Parity Summary`)
  lines.push('')
  lines.push(`- Project: ${projectId ?? 'unknown'}`)
  lines.push(`- en.json: ${path.relative(process.cwd(), enPath)}`)
  lines.push(`- Timestamp: ${report.summary.timestamp}`)
  lines.push('')
  lines.push(`- missingInJson: ${report.summary.totals.missingInJson}`)
  lines.push(`- missingInFirestore: ${report.summary.totals.missingInFirestore}`)
  lines.push(`- fieldMismatches: ${report.summary.totals.fieldMismatches}`)
  lines.push(`- extraFieldsInJson: ${report.summary.totals.extraFieldsInJson}`)
  lines.push('')
  function section<T>(title: string, arr: T[], mapper: (v: T) => string) {
    if (arr.length === 0) return
    lines.push(`## ${title}`)
    for (const item of arr.slice(0, 200)) {
      lines.push(`- ${mapper(item)}`)
    }
    if (arr.length > 200) lines.push(`- ... and ${arr.length - 200} more`)
    lines.push('')
  }
  section('Missing In JSON', missingInJson, (v) => {
    const x = v as DiffEntryMissing
    return `${x.collection} → ${x.id} @ ${x.path}`
  })
  section('Missing In Firestore', missingInFirestore, (v) => {
    const x = v as DiffEntryMissing
    return `${x.collection} → ${x.id} @ ${x.path}`
  })
  section('Field Mismatches', fieldMismatches, (v) => {
    const x = v as DiffEntryMismatch
    return `${x.collection} → ${x.id} :: ${x.fieldPath} :: firestore=${JSON.stringify(x.firestoreValue)} json=${JSON.stringify(x.jsonValue)}`
  })
  section('Extra Fields In JSON', extraFieldsInJson, (v) => {
    const x = v as DiffEntryExtraField
    return `${x.collection} → ${x.id} :: ${x.fieldPath}`
  })
  fs.writeFileSync(mdOut, lines.join('\n'), 'utf8')

  console.log(`✅ Wrote parity report: ${path.relative(process.cwd(), jsonOut)}`)
  console.log(`✅ Wrote parity summary: ${path.relative(process.cwd(), mdOut)}`)
}

main().catch((err) => {
  console.error('❌ Parity script failed:', err)
  process.exit(1)
})


