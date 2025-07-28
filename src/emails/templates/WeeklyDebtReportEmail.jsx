import { formatCurrency } from "@/utils/formatCurrency";
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Section,
  Text,
  Hr,
} from "@react-email/components";

const styles = {
  body: {
    backgroundColor: "#f9fafb",
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
  },
  container: {
    padding: "16px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    maxWidth: "900px",
    margin: "0 auto",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  mainHeading: {
    color: "#1f2937",
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "8px",
    textAlign: "center",
  },
  weekText: {
    color: "#6b7280",
    fontSize: "16px",
    textAlign: "center",
    marginBottom: "16px",
  },
  studentSection: {
    marginBottom: "16px",
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  studentName: {
    color: "#1f2937",
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "16px",
  },
  debtContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "12px",
  },
  debtColumn: {
    flex: "1",
    textAlign: "center",
    marginRight: "32px",
  },
  debtLabel: {
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  debtValue: {
    color: "#dc2626",
    fontSize: "16px",
    fontWeight: "bold",
  },
  amountValue: {
    color: "#059669",
    fontSize: "16px",
    fontWeight: "bold",
  },
  hr: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "16px 0",
  },
  problemsHeading: {
    color: "#dc2626",
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "16px",
    marginBottom: "16px",
  },
  problemsText: {
    color: "#6b7280",
    fontSize: "16px",
    marginBottom: "12px",
  },
  problemsList: {
    margin: "0",
    paddingLeft: "16px",
  },
  problemsListItem: {
    color: "#374151",
    fontSize: "14px",
    marginBottom: "4px",
  },
  noStudentsText: {
    color: "#6b7280",
    fontSize: "16px",
    textAlign: "center",
    padding: "20px 20px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },
};

export function WeeklyDebtReportEmail({
  week,
  students,
  problemsStudents,
  isLimitEmails,
}) {
  return (
    <Html lang="es">
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading as="h2" style={styles.mainHeading}>
            📊 Resumen Semanal de Alerta de Deudas
          </Heading>
          <Text style={styles.weekText}>Semana {week}</Text>

          <Hr style={styles.hr} />

          {isLimitEmails && (
            <Heading as="h3" style={styles.problemsHeading}>
              ❗ Si ve este mensaje es porque se alcanzó el límite de correos
              electrónicos enviados por día. ❗
            </Heading>
          )}

          <Hr style={styles.hr} />

          {students.length === 0 ? (
            <Text style={styles.noStudentsText}>
              ✅ No se notificó a ningún estudiante esta semana.
            </Text>
          ) : (
            <Section>
              {students.map((student, index) => (
                <Section key={index} style={styles.studentSection}>
                  <Text style={styles.studentName}>👤 {student.shortName}</Text>

                  <div style={styles.debtContainer}>
                    <div style={styles.debtColumn}>
                      <Text style={styles.debtLabel}>Clases en deuda</Text>
                      <Text style={styles.debtValue}>
                        {student.unpaidCount}
                      </Text>
                    </div>

                    <div style={styles.debtColumn}>
                      <Text style={styles.debtLabel}>Monto total estimado</Text>
                      <Text style={styles.amountValue}>
                        {formatCurrency(student.totalAmount)}
                      </Text>
                    </div>
                  </div>
                </Section>
              ))}
            </Section>
          )}

          <Hr style={styles.hr} />

          {problemsStudents.length > 0 && (
            <>
              <Heading as="h3" style={styles.problemsHeading}>
                ❗ Problemas al notificar
              </Heading>
              <Text style={styles.problemsText}>
                No se pudo enviar notificación a los siguientes estudiantes:
              </Text>
              <ul style={styles.problemsList}>
                {problemsStudents.map((name, i) => (
                  <li key={i} style={styles.problemsListItem}>
                    <Text>{name}</Text>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Container>
      </Body>
    </Html>
  );
}
