import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
} from "@react-email/components";
import * as React from "react";

interface WelcomeSubscriberEmailProps {
  email: string;
}

export const WelcomeSubscriberEmail = ({ email }: WelcomeSubscriberEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Tu código de 10% de descuento en LUZI MARKET</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>¡Hola!</Heading>
          <Text style={text}>
            Gracias por suscribirte a LUZI MARKET. Como prometimos, aquí tienes tu código de 10% de descuento para tu primera compra:
          </Text>
          <Section style={codeBox}>
            <Text style={codeText}>BIENVENIDO10</Text>
          </Section>
          <Text style={text}>
            Usa este código en el carrito antes de finalizar tu compra para aplicar el descuento a regalos seleccionados a mano.
          </Text>
          <Text style={footer}>
            ¡Esperamos que disfrutes regalando (o consintiéndote)! - El equipo de LUZI MARKET
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeSubscriberEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
};

const text = {
  color: "#4a4a4a",
  fontSize: "14px",
  lineHeight: "24px",
};

const codeBox = {
  background: "#FFD700",
  borderRadius: "4px",
  margin: "16px auto 16px",
  padding: "24px",
  textAlign: "center" as const,
};

const codeText = {
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0",
  color: "#000",
  letterSpacing: "4px",
};

const footer = {
  color: "#898989",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "32px",
};
