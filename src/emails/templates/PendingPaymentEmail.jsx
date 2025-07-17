import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Img,
  Heading,
  Hr,
} from "@react-email/components";
import * as React from "react";

export function PendingPaymentEmail({ studentName }) {
  return (
    <Html lang="es">
      <Head />
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <div style={logo}>
              <Img
                src="https://gestion.homeclickclass.com/logo.png"
                alt="Logo"
                width={"120"}
                height={"120"}
              />
            </div>
            <Heading as="h1" style={heading}>
              Home Click Class
            </Heading>
            <Text style={subheading}>
              Tu centro de aprendizaje de confianza
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>¡Hola {studentName}! 👋</Text>

            <Text style={message}>
              Esperamos que te encuentres muy bien. Te escribimos para
              recordarte que tienes algunas clases pendientes de pago.
            </Text>

            <Section style={card}>
              <Text style={{ fontSize: "14px", color: "#555" }}>
                Si ya realizaste el pago, por favor ignora este mensaje.
              </Text>
            </Section>

            {/* Payment Methods */}
            <Section style={paymentSection}>
              <Heading as="h3" style={benefitsTitle}>
                💳 Formas de Pago
              </Heading>

              {/* Wompi */}
              <div style={paymentCard}>
                <Text style={paymentTitle}>Wompi</Text>
                <Img
                  src="https://gestion.homeclickclass.com/wompi_qr.jpeg"
                  alt="QR Wompi"
                  width="150"
                  height="150"
                  style={qrImage}
                />
                <Text>
                  Puedes pagar fácilmente con el siguiente enlace:
                  <br />
                  <a
                    href="https://checkout.wompi.co/l/gchayM"
                    style={{ color: "#007bff" }}
                  >
                    Ir al enlace de pago Wompi
                  </a>
                </Text>
              </div>

              {/* Nequi */}
              <div style={paymentCard}>
                <Text style={paymentTitle}>Nequi</Text>
                <Img
                  src="https://gestion.homeclickclass.com/nequi-qr.png"
                  alt="QR Nequi"
                  width="150"
                  height="150"
                  style={qrImage}
                />
                <Text>
                  Número Nequi: <strong>+57 3024692289</strong>
                </Text>
              </div>

              {/* Bancolombia */}
              <div style={paymentCard}>
                <Text style={paymentTitle}>Bancolombia</Text>
                <Img
                  src="https://gestion.homeclickclass.com/bancolombia-qr.png"
                  alt="QR Bancolombia"
                  width="150"
                  height="150"
                  style={qrImage}
                />
                <Text>
                  Cuenta de ahorros: <strong>550-638980-14</strong>
                </Text>
              </div>
            </Section>

            <Text style={message}>
              Sabemos que a veces se nos pueden pasar las fechas, ¡no te
              preocupes! Queremos facilitarte el proceso de pago para que puedas
              continuar con tu aprendizaje sin interrupciones.
            </Text>          

            <Text style={message}>
              Agradecemos tu confianza en nosotros y esperamos continuar siendo
              parte de tu crecimiento académico. ¡Estamos aquí para apoyarte en
              cada paso del camino!
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text>
              <strong>Home Click Class</strong>
            </Text>

            <Hr style={{ margin: "20px 0", borderColor: "#ffffff30" }} />
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: "#f4f4f4", padding: "12px" };
const container = {
  backgroundColor: "#fff",
  maxWidth: "900px",
  margin: "0 auto",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};
const header = {
  padding: "12px",
  textAlign: "center",
};
const logo = {
  width: "120px",
  height: "120px",
  backgroundColor: "rgba(255,255,255,0.2)",
  borderRadius: "50%",
  margin: "0 auto 12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "32px",
};
const heading = { fontSize: "19px", marginBottom: "0px", fontWeight: "600" };
const subheading = { fontSize: "12px", opacity: 0.9 };
const content = { padding: "12px" };
const greeting = { fontSize: "14px", color: "#2c3e50" };
const message = {
  fontSize: "14px",
  lineHeight: "1.8",
  color: "#555",
  marginBottom: "16px",
};
const card = {
  backgroundColor: "#f8f9fa",
  borderLeft: "4px solid #e74c3c",
  padding: "12px",
  borderRadius: "8px",
  margin: "16px 0",
};
const paymentSection = {
  backgroundColor: "#f4f4f4",
  padding: "20px",
  borderRadius: "12px",
  margin: "16px 0",
};

const paymentCard = {
  backgroundColor: "#ffffff",
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "16px",
  textAlign: "center",
};

const paymentTitle = {
  fontSize: "14px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const qrImage = {
  margin: "10px auto",
  display: "block",
  borderRadius: "8px",
};

const benefitsTitle = {
  textAlign: "center",
  marginBottom: "16px",
  color: "#2c3e50",
};
const footer = {
  backgroundColor: "#2c3e50",
  color: "white",
  padding: "24px",
  textAlign: "center",
  fontSize: "14px",
};
