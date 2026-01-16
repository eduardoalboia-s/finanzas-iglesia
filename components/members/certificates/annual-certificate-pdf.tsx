import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'

// Registrar fuentes (opcional, usaremos estándar por ahora)
// Font.register({ family: 'Roboto', src: '...' })

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 40,
    borderBottom: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 20,
  },
  churchInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  churchName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  churchDetails: {
    fontSize: 10,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    textTransform: 'uppercase',
  },
  body: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 20,
    textAlign: 'justify',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 20,
    marginBottom: 20,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  totalRow: {
    margin: 'auto',
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
  },
  footer: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
  },
  signature: {
    marginTop: 60,
    alignItems: 'center',
  },
  signatureLine: {
    width: 200,
    borderTop: 1,
    borderTopColor: '#000',
    marginBottom: 5,
  },
})

interface AnnualCertificateProps {
  member: {
    firstName: string
    lastName: string
    rut: string | null
  }
  year: number
  totals: {
    tithes: number
    offerings: number
    construction?: number
    special: number
    total: number
  }
  church: {
    name: string
    address: string | null
    logoUrl: string | null
    treasurerName: string | null
  }
}

export function AnnualCertificatePDF({ member, year, totals, church }: AnnualCertificateProps) {
  const currentDate = new Date().toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          {church.logoUrl && (
            <Image src={church.logoUrl} style={styles.logo} />
          )}
          <View style={styles.churchInfo}>
            <Text style={styles.churchName}>{church.name}</Text>
            <Text style={styles.churchDetails}>{church.address || 'Dirección no registrada'}</Text>
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>Certificado de Donación</Text>

        {/* Cuerpo */}
        <Text style={styles.body}>
          Por medio de la presente, la {church.name} certifica que el/la Sr/Sra. {member.firstName} {member.lastName}, 
          RUT {member.rut || 'N/A'}, ha realizado aportes voluntarios a nuestra institución durante el año fiscal {year}.
        </Text>

        <Text style={styles.body}>
          El detalle de los aportes recibidos es el siguiente:
        </Text>

        {/* Tabla de Totales */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Concepto</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold', textAlign: 'right' }]}>Monto Anual (CLP)</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Diezmos</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { textAlign: 'right' }]}>${totals.tithes.toLocaleString('es-CL')}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Ofrendas Generales</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { textAlign: 'right' }]}>${totals.offerings.toLocaleString('es-CL')}</Text>
            </View>
          </View>

          {totals.construction && totals.construction > 0 ? (
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Aportes Construcción</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, { textAlign: 'right' }]}>${totals.construction.toLocaleString('es-CL')}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Ofrendas Especiales / Otros</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { textAlign: 'right' }]}>${totals.special.toLocaleString('es-CL')}</Text>
            </View>
          </View>

          <View style={styles.totalRow}>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>TOTAL APORTADO</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold', textAlign: 'right' }]}>${totals.total.toLocaleString('es-CL')}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.body}>
          Se extiende el presente certificado a petición del interesado para los fines que estime conveniente.
        </Text>

        {/* Firma */}
        <View style={styles.signature}>
          <View style={styles.signatureLine} />
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{church.treasurerName || 'Tesorero General'}</Text>
          <Text style={{ fontSize: 10 }}>Tesorero(a) {church.name}</Text>
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text>Emitido el {currentDate}</Text>
          <Text>Este documento es un comprobante interno de la iglesia.</Text>
        </View>
      </Page>
    </Document>
  )
}
