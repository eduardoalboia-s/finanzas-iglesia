import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { numberToWords } from '@/lib/utils/number-to-words'

// Definir estilos
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333'
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#112233',
    paddingBottom: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerLeft: {
    maxWidth: '60%',
    paddingRight: 10,
  },
  churchName: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#112233'
  },
  churchInfo: {
    fontSize: 8,
    color: '#666',
    marginTop: 4
  },
  receiptBadge: {
    borderWidth: 1,
    borderColor: '#cc0000',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    width: 150
  },
  receiptTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#cc0000'
  },
  receiptNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#cc0000',
    marginTop: 4
  },
  section: {
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8
  },
  label: {
    width: 100,
    fontWeight: 'bold',
    color: '#555'
  },
  value: {
    flex: 1
  },
  amountBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#112233'
  },
  amountLiteral: {
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 4,
    color: '#666'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 30
  },
  signatureBox: {
    width: '40%',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 5,
    alignItems: 'center'
  },
  qrCode: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: 0,
    right: 0
  }
})

interface ReceiptProps {
  transaction: {
    id: string
    receiptNumber: number | null
    date: Date
    amount: number
    type: string
    category: string
    description: string | null
    member?: {
      firstName: string
      lastName: string
      rut?: string | null
    } | null
  }
  church: {
    name: string
    address?: string | null
    rut?: string | null
    logoUrl?: string | null
  }
  qrDataUrl?: string
}

export const ReceiptPDF = ({ transaction, church, qrDataUrl }: ReceiptProps) => {
  const formattedDate = new Date(transaction.date).toLocaleDateString('es-CL')
  const formattedTime = new Date(transaction.date).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })

  // Construir URL absoluta para la imagen si es relativa
  // Nota: react-pdf en cliente necesita URL accesible o base64
  // Como esto corre en cliente, usamos window.location.origin
  const logoSrc = church.logoUrl
    ? (church.logoUrl.startsWith('http') ? church.logoUrl : `${window.location.origin}${church.logoUrl}`)
    : null

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Encabezado */}
        <View style={styles.header}>
          {logoSrc && (
            <Image
              src={logoSrc}
              style={{ width: 60, height: 60, marginRight: 15, borderRadius: 30 }}
            />
          )}
          <View style={styles.headerLeft}>
            <Text style={styles.churchName}>{church.name}</Text>
            <Text style={styles.churchInfo}>{church.address || 'Dirección no registrada'}</Text>
            <Text style={styles.churchInfo}>RUT: {church.rut || 'N/A'}</Text>
          </View>
          <View style={styles.receiptBadge}>
            <Text style={styles.receiptTitle}>RECIBO DE INGRESO</Text>
            <Text style={styles.receiptNumber}>N° {String(transaction.receiptNumber ?? 0).padStart(6, '0')}</Text>
          </View>
        </View>

        {/* Información del Ofrendante */}
        <View style={styles.section}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 }}>
            DATOS DEL OFRENDANTE
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>
              {transaction.member
                ? `${transaction.member.firstName} ${transaction.member.lastName}`.toUpperCase()
                : 'ANÓNIMO / SIN REGISTRO'}
            </Text>
          </View>
          {transaction.member?.rut && (
            <View style={styles.row}>
              <Text style={styles.label}>RUT/ID:</Text>
              <Text style={styles.value}>{transaction.member.rut}</Text>
            </View>
          )}
        </View>

        {/* Detalle de la Transacción */}
        <View style={styles.section}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 }}>
            DETALLE DEL INGRESO
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>{formattedDate} {formattedTime} hrs</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Concepto:</Text>
            <Text style={styles.value}>{transaction.category.replace('_', ' ')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Descripción:</Text>
            <Text style={styles.value}>{transaction.description || '-'}</Text>
          </View>
        </View>

        {/* Monto */}
        <View style={styles.amountBox}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.amountLabel}>TOTAL RECIBIDO:</Text>
              <Text style={styles.amountValue}>${transaction.amount.toLocaleString('es-CL')}</Text>
            </View>
            <Text style={styles.amountLiteral}>SON: {numberToWords(transaction.amount)}</Text>
          </View>
          {qrDataUrl && (
            <Image src={qrDataUrl} style={{ width: 60, height: 60 }} />
          )}
        </View>

        {/* Firmas */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 8 }}>TESORERÍA</Text>
            <Text style={{ fontSize: 8, color: '#999', marginTop: 20 }}>Firma Autorizada</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 8 }}>OFRENDANTE</Text>
          </View>
        </View>

        {/* Pie de Página */}
        <View style={styles.footer}>
          <Text style={{ fontSize: 8, color: '#999' }}>
            Este documento es un comprobante interno de la Iglesia.
            Generado automáticamente el {new Date().toLocaleDateString()}
            Folio Digital: {transaction.id}
          </Text>
        </View>

      </Page>
    </Document>
  )
}
